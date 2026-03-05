import { formatData } from "../../functions/formatData"
import { DB } from "../../services/DB"
import { Data, FilterItem } from "../../types/types"

const db = new DB()

export class ClipboardModel {
    public async getData(limit?: number) {
        const data = await db.get({ info: "clipboard" }, { limit, order: "DESC" })
        return data ? formatData(data) : []
    }

    public async getOneData(id: string) {
        const data = await db.get({ _id: id })
        if (!data || data.length === 0) return null
        return {
            id: data[0]._id,
            type: data[0].type,
            createdAt: (new Date(data[0].createdAt).getTime()),
            source: data[0].source,
            value: data[0].content
        }
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

    public async findData(searchItem: string) {
        const data = await db.find({ searchItem }, { order: "DESC" })
        return data ? formatData(data) : []
    }

    public async findWithFilterData(filterItemType: FilterItem) {
        const data = await db.find({ filterItemType }, { order: "DESC" })
        return data ? formatData(data) : []
    }

    public async getFavoriteData() {
        const data = await db.find({ favorite: true }, { order: "DESC" })
        return data ? formatData(data) : []
    }

    public async toggleFavoriteData(_id: string) {
        const data = await db.get({ _id })
        if (!data || data.length === 0) {
            return false
        }
        return !!await db.update(_id, { favorite: !data[0].favorite })
    }
} 