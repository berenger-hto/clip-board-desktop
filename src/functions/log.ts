import path from "node:path"
import { app } from "electron"
import { appendFileSync } from "node:fs"

export function log(...message: string[]): string {
    const logPath = path.join(app.getPath("userData"), "app.log")
    const line = `[${new Date().toISOString()}] ${message.join(" ")}\n`
    appendFileSync(logPath, line)
    return line
}