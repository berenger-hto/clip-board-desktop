import clipboard from "clipboardy"
import { setInterval } from "node:timers"
import { insertDataToDB } from "../services/Clipboard.service"

let lastContent = ''

export function watcher() {
    setInterval(async () => {
        try {
            const currentContent = await clipboard.read()

            if (!currentContent || currentContent === lastContent) {
                return
            }

            lastContent = currentContent

            await insertDataToDB(currentContent)

            console.log(currentContent)

            console.log("Nouveau contenu sauvegardé !")
        } catch (err) {
            console.error("Erreur lecture/écriture :", err)
        }
    }, 1000)
}