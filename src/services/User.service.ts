import { randomBytes } from "node:crypto"
import { UserModel } from "../server/model/User.model"
import type { Context, Next } from "hono"
import { HTTPException } from "hono/http-exception"
import { env } from "../constants/env"

const userModel = new UserModel()

export class UserService {
    static async createUniqueUserToken() {
        const tokenExist = await userModel.tokenExist()
        if (tokenExist) return
        await userModel.saveUserToken(randomBytes(32).toString('base64'))
    }

    static async authorize(c: Context, next: Next) {
        const authorizeCKey = c.req.header("Authorization-key")
        const authorizationKey = env.AUTHORIZATION_KEY
        if (authorizeCKey && authorizationKey === authorizeCKey) {
            await next()
        } else {
            throw new HTTPException(401, { message: "Clé d'autorisation invalide !" })
        }
    }
}