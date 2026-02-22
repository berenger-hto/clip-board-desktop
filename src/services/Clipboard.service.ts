import { DB } from "./DB";
import { contentType } from "../functions/detectContentType";
import { ClipboardModel } from "../server/model/Clipboard.model";
import { Notification } from "electron";
import { io } from "../server/hono";
import clipboard from "clipboardy";

const db = new DB()
const clipboardModel = new ClipboardModel()

export async function insertDataToDB(content: string) {
    const type = contentType(content)
    await db.insert({ info: "clipboard", content, type, source: "PC" })
}

export async function getLastEntry() {
    const results = await db.get({ info: "clipboard" }, { limit: 1, order: "DESC" })
    return (results && (results as any[]).length > 0) ? results[0] : null
}

export async function getDataToDB(limit: number = 50) {
    return await clipboardModel.getData(limit)
}

export async function deleteToDB(id: string) {
    const isDeleted = await clipboardModel.deleteData(id)
    if (isDeleted) {
        io.emit("clipboard", true)
    }

    new Notification({
        title: "ClipboardX",
        body: isDeleted ? "Données supprimées !" : "Erreur lors de la suppression"
    }).show()
}

export async function deleteAllToDB() {
    const isDeleted = await clipboardModel.deleteData({ info: "clipboard" }, true)
    if (isDeleted) {
        io.emit("clipboard", true)
    }

    new Notification({
        title: "ClipboardX",
        body: isDeleted ? "Toutes les données ont été supprimées !" : "Erreur lors de la suppression"
    }).show()
}

export async function contentExist(content: string, limit: number = 50) {
    console.time("ContentExist")
    const data = await db.findOne({ info: "clipboard", content })
    console.timeEnd("ContentExist")
    return !!data
}


export async function writeToClipboard(content: string) {
    try {
        await clipboard.write(content)
    } catch {
        new Notification({
            title: "ClipboardX",
            body: "Erreur lors de l'écriture dans le presse-papier"
        }).show()
    }
}