import { Context } from "hono";
import { UserModel } from "../model/User.model";
import os from "node:os"


const userModel = new UserModel()

export class UserController {
    public static async infos(c: Context) {
        const deviceName = os.hostname()
        const platform = os.platform()
        const username = os.userInfo().username

        return c.json({
            success: true,
            message: "Utilisateur authentifié !",
            os: {
                deviceName,
                username,
                platform
            }
        })
    }
}