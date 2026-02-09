import clipboard from "clipboardy"
import { setInterval } from "node:timers"

let lastText = ''

export function watcher() {
    setInterval(() => {
        let currentText = clipboard.readSync()
        lastText = currentText
        console.log(lastText)
        if (lastText && lastText !== currentText) {
            lastText = currentText
            // insertToDb(lastText)
        }
    }, 500)
}