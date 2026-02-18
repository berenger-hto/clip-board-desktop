import { Context } from "hono";
import { UserModel } from "../model/User.model";
import os from "node:os"
import { z } from "zod"
import { HTTPException } from "hono/http-exception";
import { DeviceModel } from "../model/Device.model";
import { Notification } from "electron";

const userModel = new UserModel()
const deviceModel = new DeviceModel()

const dataSchema = z.object({
    ip: z.ipv4({ error: "Adresse IP invalide" }),
    token: z.string({ error: "Token invalide" }),
    expiresAt: z.number({ error: "Date d'expiration invalide" }),
    deviceName: z.string({ error: "Nom du mobile inconnu" }),
    deviceOSName: z.string({ error: "Nom du système inconnu" }),
    deviceOSVersion: z.string({ error: "Version du système inconnu" })
})


export class UserController {
    public static async me(c: Context) {
        const body = await c.req.json()
        const data = dataSchema.parse(body)

        const privateIp = Object.values(os.networkInterfaces())
            .flat()
            .find((details) => details?.family === "IPv4" && !details.internal)?.address

        if (privateIp !== data.ip) {
            throw new HTTPException(401, { message: "Adresse IP invalide" })
        }

        const userToken = await userModel.getUserToken()
        if (!userToken || userToken !== data.token) {
            throw new HTTPException(401, { message: "Token invalide" })
        }

        if (Date.now() >= data.expiresAt) {
            throw new HTTPException(401, { message: "Token expiré. Actualisez le QR Code" })
        }

        const deviceName = os.hostname()
        const platform = os.platform()
        const username = os.userInfo().username

        const allDevices = await deviceModel.getAllDevices()
        const deviceExist = allDevices.find(d =>
            d.deviceName.trim() === data.deviceName.trim() &&
            d.deviceOSName.trim() === data.deviceOSName.trim() &&
            d.deviceOSVersion.trim() === data.deviceOSVersion.trim()
        )

        if (!deviceExist) {
            await deviceModel.addDevice(data.deviceName, data.deviceOSName, data.deviceOSVersion)
        }

        new Notification({
            title: "Appareil connecté !",
            body: `${data.deviceName} est connecté !`,
        }).show()

        return c.json({
            success: true,
            message: "Appareil connecté !",
            os: {
                deviceName,
                username,
                platform,
            }
        })
    }
}