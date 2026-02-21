import { DB } from "./DB"

const db = new DB()

export async function getDevices() {
    const data = await db.get({ device: "device" }, { order: "DESC" })
    return data ? data: []
}