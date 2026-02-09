import { JSONFilePreset } from 'lowdb/node'
import { existsSync, writeFileSync } from 'node:fs'
import { join } from "node:path"

const dbPath = join(__dirname, "..", "..", "db", "db.json")
const defaultData = {
    posts: [],
    user: []
}

export class UserModel {
    constructor() {
        if (!existsSync(dbPath)) {
            console.error("Database not found !")
            process.kill(process.pid, 'SIGINT')
        }

    }

    public async createUniqueToken(token: string = "yo") {

        type Data = {
            messages: string[]
        }

        const defaultData: Data = { messages: [] }
        const db = await JSONFilePreset<Data>(dbPath, defaultData)

        db.data.messages.push('foo') // ✅ Success

    }
}