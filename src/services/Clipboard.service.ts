import { DB } from "./DB";
import { contentType } from "../functions/detectContentType";

const db = new DB()

export async function insertDataToDB(content: string) {
    const type = contentType(content)
    await db.insert({ info: "clipboard", content, type, source: "PC" })
}

export async function getLastEntry() {
    const results = await db.get({ info: "clipboard" }, { limit: 1, order: "DESC" })
    return (results && (results as any[]).length > 0) ? results[0] : null
}