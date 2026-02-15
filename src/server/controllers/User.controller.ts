import { Context } from "hono";
import { UserModel } from "../model/User.model";
import os from "node:os"
import { z } from "zod"
import { HTTPException } from "hono/http-exception";

const userModel = new UserModel()

const dataSchema = z.object({
    ip: z.ipv4({ error: "Adresse IP invalide" }),
    token: z.string({ error: "Token invalide" }),
    expiresAt: z.number({ error: "Date d'expiration invalide" })
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
            throw new HTTPException(401, { message: "Token expiré. Raffraichir le QR Code" })
        }

        const deviceName = os.hostname()
        const platform = os.platform()
        const username = os.userInfo().username

        return c.json({
            success: true,
            message: "Utilisateur authentifié !",
            os: {
                deviceName,
                username,
                platform,
            }
        })
    }
}