import Datastore from "@seald-io/nedb"
import { dbPath } from "../constants/baseDir"
import { Data, Option } from "../types/types"

export class DB {
    private static instance: Datastore | null = null
    private static loadingPromise: Promise<Datastore> | null = null

    private async loadDB(): Promise<Datastore> {
        if (DB.instance) {
            return DB.instance
        }

        if (DB.loadingPromise) {
            return DB.loadingPromise
        }

        DB.loadingPromise = (async () => {
            const db = new Datastore({
                filename: dbPath,
                autoload: true,
                timestampData: true
            })

            try {
                await db.loadDatabaseAsync()
                DB.instance = db

                try {
                    await db.ensureIndexAsync({ fieldName: 'content' })
                } catch (idxError) {
                    console.warn("Info: l'index sur 'content' n'a pas pu être créé ", (idxError as Error).message)
                }

                return db
            } catch (error) {
                console.error("Erreur lors du chargement de la base de donnée: " + (error as Error).message)
                process.kill(process.pid, 'SIGINT')
                throw error
            } finally {
                DB.loadingPromise = null
            }
        })()

        return DB.loadingPromise
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
        if (!data) return []
        try {
            let query = db.findAsync(data)
            if (options?.order) {
                query = query.sort({ updatedAt: options.order === "DESC" ? -1 : options.order === "ASC" ? 1 : 0 })
            }

            if (options?.limit) {
                query = query.limit(options.limit)
            }
            return await query
        } catch (e) {
            console.error("Erreur lors de la récupération des données dans la base de donnée : " + (e as Error).message)
            process.kill(process.pid, 'SIGINT')
        }
    }

    async delete(item: string | Record<string, string | number>, multi: boolean = false) {
        const db = await this.loadDB()
        const numRemoved = await db.removeAsync(typeof item === "string" ? { _id: item } : item, { multi })
        return numRemoved > 0
    }

    async findOne(item: Record<string, string | number>) {
        const db = await this.loadDB()
        try {
            return await db.findOneAsync(item)
        } catch (e) {
            console.error("Erreur lors de la recherche dans la base de donnée : " + (e as Error).message)
            process.kill(process.pid, 'SIGINT')
        }
    }

    async update(item: Record<string, string | number> | string, data: Data) {
        const db = await this.loadDB()
        try {
            const { numAffected } = await db.updateAsync(typeof item === "string" ? { _id: item } : item, { $set: data })
            return numAffected > 0
        } catch (e) {
            console.error("Erreur lors de la mise à jour dans la base de donnée : " + (e as Error).message)
            process.kill(process.pid, 'SIGINT')
        }
    }
}