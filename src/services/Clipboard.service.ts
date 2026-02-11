import { DB } from "./DB";

const db = new DB()

export async function insertDataToDB(content: string, type: string = "TEXT") {
    await db.insert({ info: "clipboard", content, type })
}