import { DB } from "../../services/DB"

const db = new DB()

export class UserModel {

    public async tokenExist() {
        const getTokenLine = await db.get({ user: "uniq" })
        return getTokenLine && getTokenLine?.length > 0
    }

    public async saveUserToken(token: string) {
        await db.insert({ user: "uniq", token })
    }

    public async getUserToken() {
        const getTokenLine = await db.get({ user: "uniq" })
        if (getTokenLine && getTokenLine.length > 0) {
            return getTokenLine[0].token as string
        }
        
        return null
    }
}