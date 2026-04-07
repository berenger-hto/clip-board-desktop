import { Context } from "hono";
import { UserModel } from "../model/User.model";
import os from "node:os"
import { z } from "zod"
import { HTTPException } from "hono/http-exception";
import { DeviceModel } from "../model/Device.model";
import { Notification } from "electron";
import { io } from "../hono";
import { NetworkService } from "../../services/Network.service";

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

        const ips = NetworkService.getAllIp()

        if (!ips) {
            throw new HTTPException(503, { message: "Aucun réseau détecté sur le PC" })
        }

        if (!ips.includes(data.ip)) {
            throw new HTTPException(403, { message: "Utilisez le même réseau que le PC" })
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

        const deviceExist = await deviceModel.findDevice(data)

        if (!deviceExist) {
            await deviceModel.addDevice(data.deviceName, data.deviceOSName, data.deviceOSVersion)
        } else {
            const isUpdated = await deviceModel.updateDevice(deviceExist._id, { ...data })
            if (!isUpdated) {
                throw new HTTPException(500, { message: "Erreur lors de la mise à jour de l'appareil" })
            }
        }

        new Notification({
            title: "Appareil connecté !",
            body: `${data.deviceName} est connecté !`,
        }).show()

        io.emit("device:connected", true)

        return c.json({
            success: true,
            message: "Appareil connecté !",
            os: {
                deviceName,
                username,
                platform,
            },
        })
    }
}