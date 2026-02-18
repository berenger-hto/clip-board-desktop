import { randomBytes } from "node:crypto"
import { UserModel } from "../server/model/User.model"
import { type BrowserWindow } from "electron"

const userModel = new UserModel()

export class UserService {
    static async createUniqueUserToken() {
        const tokenExist = await userModel.tokenExist()
        if (tokenExist) return
        const token = randomBytes(32).toString('base64')
        await userModel.saveUserToken(token)
    }

    static async getUniqueUserToken() {
        return await userModel.getUserToken()
    }
}