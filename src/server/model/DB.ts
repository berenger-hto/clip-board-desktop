import { JSONFilePreset } from 'lowdb/node'
import { existsSync, writeFileSync } from 'node:fs'
import { join } from "node:path"

const dbPath = join(__dirname, "..", "..", "db", "db.json")

export class DB {
    constructor() {
        if (!existsSync(dbPath)) {
            console.error("Database not found !")
            process.kill(process.pid, 'SIGINT')
        }
    }

    public createUniqueToken(token: string) {
        
    }
}