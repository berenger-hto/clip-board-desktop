import { DB } from "./DB";

const db = new DB()

export async function insertDataToDB(content: string, type: string = "TEXT") {
    await db.insert({ info: "clipboard", content, type })
}

export async function getLastEntry() {
    const results = await db.get({ info: "clipboard" }, { limit: 1, order: "DESC" })
    return (results && (results as any[]).length > 0) ? results[0] : null
}