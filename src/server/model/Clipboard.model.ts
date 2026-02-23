import { DB } from "../../services/DB"
import { Data } from "../../types/types"

const db = new DB()

export class ClipboardModel {
    public async getData(limit: number) {
        const data = await db.get({ info: "clipboard" }, { limit, order: "DESC" })
        return data ? data.map(d => ({
            id: d._id,
            type: d.type,
            createdAt: (new Date(d.createdAt).getTime()),
            source: d.source,
            value: d.content
        })) : []
    }

    public async deleteData(item: string | Record<string, string | number>, multiMode: boolean = false) {
        return await db.delete(item, multiMode)
    }

    public async insertData(data: Data) {
        return await db.insert({ info: "clipboard", ...data })
    }

    public async updateData(_id: string, content: string, type: string) {
        const data = await db.get({ _id })
        if (!data) {
            return false
        }
        return !!await db.update(_id, { content, type })
    }
} 