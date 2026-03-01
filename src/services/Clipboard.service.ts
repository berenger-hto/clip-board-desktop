import { DB } from "./DB";
import { contentType } from "../functions/detectContentType";
import { ClipboardModel } from "../server/model/Clipboard.model";
import { Notification } from "electron";
import { io } from "../server/hono";
import clipboard from "clipboardy";
import type { FilterItem } from "../types/types";

const db = new DB()
const clipboardModel = new ClipboardModel()

export class ClipboardService {
    public static async addClipboardEntry(content: string, source: string, providedType: string = "AUTO") {
        let type = providedType
        if (type === "AUTO") {
            type = contentType(content)
        }

        const exist = await this.contentExist(content)
        if (!exist) {
            await clipboardModel.insertData({ info: "clipboard", content, type, source })
        }

        io.emit("clipboard", true)

        return { success: true, exist }
    }

    public static async updateClipboardEntry(id: string, content: string, providedType: string = "AUTO") {
        let type = providedType
        if (type === "AUTO") {
            type = contentType(content)
        }

        const isUpdated = await clipboardModel.updateData(id, content, type)
        if (isUpdated) {
            io.emit("clipboard", true)
        }
        return isUpdated
    }

    public static async deleteClipboardEntry(id: string) {
        const isDeleted = await clipboardModel.deleteData(id)
        if (isDeleted) {
            io.emit("clipboard", true)
        }
        return isDeleted
    }

    public static async getLastEntry() {
        const results = await db.get({ info: "clipboard" }, { limit: 1, order: "DESC" })
        return (results && (results as any[]).length > 0) ? results[0] : null
    }

    public static async getDataToDB(limit: number = 50) {
        return await clipboardModel.getData(limit)
    }

    public static async getAllDataToDB() {
        return await clipboardModel.getData()
    }

    public static async getOneData(id: string) {
        return await clipboardModel.getOneData(id)
    }

    public static async deleteAllToDB() {
        const isDeleted = await clipboardModel.deleteData({ info: "clipboard" }, true)
        if (isDeleted) {
            io.emit("clipboard", true)
        }
        return isDeleted
    }

    public static async contentExist(content: string) {
        const data = await db.findOne({ info: "clipboard", content })
        return !!data
    }

    public static async writeToClipboard(content: string) {
        try {
            await clipboard.write(content)
        } catch {
            new Notification({
                title: "ClipboardX",
                body: "Erreur lors de l'écriture dans le presse-papier"
            }).show()
        }
    }

    public static async find(searchItem: string) {
        return await db.find({ searchItem })
    }

    public static async findWithFilter(filterItem: FilterItem) {
        return await db.find({ filterItem })
    }
}