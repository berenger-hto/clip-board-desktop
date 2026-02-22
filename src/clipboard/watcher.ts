import clipboard from "clipboardy"
import { setInterval } from "node:timers"
import { insertDataToDB, getLastEntry } from "../services/Clipboard.service"
import { io } from "../server/hono"
import { store } from "../store"
import { contentExist } from "../services/Clipboard.service"

let lastContent = ''

export async function watcher() {
    
    const lastEntry = await getLastEntry()
    if (lastEntry) {
        lastContent = lastEntry.content as string
    }

    setInterval(async () => {
        if (store.isIncognito) {
            lastContent = await clipboard.read()
            return
        }

        try {
            const currentContent = await clipboard.read()

            if (!currentContent || currentContent === lastContent) {
                return
            }

            lastContent = currentContent
            const exist = await contentExist(currentContent)
            if (exist) return 

            await insertDataToDB(currentContent)
            if (io) {
                io.emit("clipboard", currentContent)
            }

            console.log(currentContent)

            console.log("Nouveau contenu sauvegardé !")
        } catch (err) {
            console.error("Erreur lecture/écriture :", err)
        }
    }, 1000)
}