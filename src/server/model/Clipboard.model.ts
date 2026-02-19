import { DB } from "../../services/DB"

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

    public async deleteData(id: string) {
        return await db.delete(id)
    }
} 