import { app } from "electron"
import path from "path"
import { existsSync, mkdirSync } from "node:fs"
import { log } from "../functions/log"

export const getBaseDir = () => {
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';

  const bDir = isDev
    ? path.join(__dirname, '..', 'databases')
    : path.join(app.getPath('userData'));

  console.log(log(`[DB] Nom App: ${app.getName()}`));
  console.log(log(`[DB] Mode: ${isDev ? 'DEV' : 'PROD'}`));
  console.log(log(`[DB] Dossier cible : ${bDir}`));
  console.log(log(`[DB] Le fichier existe ? : ${existsSync(bDir)}`));

  if (!existsSync(bDir)) {
    try {
      console.log(log(`[DB] Création du dossier...`));
      mkdirSync(bDir, { recursive: true })

      if (existsSync(bDir)) {
        console.log(log(`[DB] Dossier créé : ${bDir}`))
      } else {
        console.error(log(` [DB] Échec de création du dossier (pas de dossier après mkdirSync)`))
      }
    } catch (err) {
      console.error(log(`[DB] Erreur fatale mkdirSync : ${bDir} : Error ${err}`))
    }
  } else {
    console.log(`[DB] Dossier déjà présent.`);
  }
  return bDir
}

export const getDbPath = () => path.join(getBaseDir(), "data.db")