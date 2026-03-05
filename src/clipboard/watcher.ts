import { clipboard } from "electron"
import { setInterval } from "node:timers"
import { ClipboardService } from "../services/Clipboard.service"
import { store } from "../store"

let lastContent = ''

export async function watcher() {

    const lastEntry = await ClipboardService.getLastEntry()
    if (lastEntry) {
        lastContent = lastEntry.content as string
    }

    setInterval(async () => {
        if (store.isIncognito) {
            lastContent = clipboard.readText()
            return
        }

        try {
            const currentContent = clipboard.readText()

            if (!currentContent || currentContent === lastContent) {
                return
            }

            lastContent = currentContent
            const exist = await ClipboardService.contentExist(currentContent)
            if (exist) return

            await ClipboardService.addClipboardEntry(currentContent, "PC", "AUTO")

            console.log(currentContent)

            console.log("Nouveau contenu sauvegardé !")
        } catch (err) {
            console.error("Erreur lecture/écriture :", err)
        }
    }, 1000)
}