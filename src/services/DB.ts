import Datastore from "@seald-io/nedb"
import { join } from "node:path"
import { baseDir } from "../constants/baseDir"

type Data = Record<string, string | number>
type Option = {
    limit?: number
    order?: "ASC" | "DESC"
}

export class DB {
    private async loadDB() {
        const db = new Datastore({
            filename: join(baseDir, "..", "db", "database.db"),
            autoload: true,
            timestampData: true
        })

        try {
            await db.loadDatabaseAsync()
        } catch (error) {
            console.error("Erreur lors du chargement de la base de donnée: " + (error as Error).message)
            process.kill(process.pid, 'SIGINT')
        }

        return db
    }

    async insert(data: Data) {
        const db = await this.loadDB()
        try {
            await db.insertAsync(data)
        } catch (e) {
            console.error("Erreur de l'ajout à la base de donnée : " + (e as Error).message)
            process.kill(process.pid, 'SIGINT')
        }
    }

    async get(data: Data = {}, options?: Option) {
        const db = await this.loadDB()
        try {
            if (options?.limit) {
                return await db.
                    findAsync(data ?? {}).
                    sort({ createdAt: options.order === "DESC" ? -1 : options.order === "ASC" ? 1 : 0 })
                    .limit(options.limit)
            }

            return await db.findAsync<Data[] | []>(data)
        } catch (e) {
            console.error("Erreur lors de la récupération des données dans la base de donnée : " + (e as Error).message)
            process.kill(process.pid, 'SIGINT')
        }
    }

    async getSmartData(limit: number = 50, order: "DESC" | "ASC" = "DESC") {
        const db = await this.loadDB()
        return await db.findAsync({})
            .sort({ createdAt: order === "DESC" ? -1 : 1 })
            .limit(limit)
    }
}