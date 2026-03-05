import { app } from "electron"
import path from "path"
import { existsSync, mkdirSync } from "node:fs"

export const getBaseDir = () => {
  const isDev = !app.isPackaged
  const bDir = isDev
    ? path.join(__dirname, '../databases')
    : path.join(app.getPath('userData'), 'databases');

  if (!existsSync(bDir)) {
    try {
      mkdirSync(bDir, { recursive: true })
      console.log(`✅ Dossier créé avec succès : ${bDir}`)
    } catch (err) {
      console.error(`❌ Impossible de créer le dossier : ${bDir}`, err)
    }
  }
  return bDir
}

export const getDbPath = () => path.join(getBaseDir(), 'data.db')