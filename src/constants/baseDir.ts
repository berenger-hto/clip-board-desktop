import { app } from "electron"
import path from "path"
import {existsSync, mkdirSync} from "node:fs"

const isDev = !app.isPackaged

export const baseDir = isDev
  ? path.join(__dirname, '../databases')
  : path.join(app.getPath('userData'), 'databases');

if (!existsSync(baseDir)) {
  try {
    mkdirSync(baseDir, { recursive: true })
    console.log(`✅ Dossier créé avec succès : ${baseDir}`)
  } catch (err) {
    console.error(`❌ Impossible de créer le dossier : ${baseDir}`, err)
  }
}

export const dbPath = path.join(baseDir, 'data.db')