import Datastore from "@seald-io/nedb"
import { dbPath } from "../constants/baseDir"
import { Data, Option } from "../types/types"

export class DB {
    private async loadDB() {
        const db = new Datastore({
            filename: dbPath,
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

            return await db.findAsync(data)
        } catch (e) {
            console.error("Erreur lors de la récupération des données dans la base de donnée : " + (e as Error).message)
            process.kill(process.pid, 'SIGINT')
        }
    }
}