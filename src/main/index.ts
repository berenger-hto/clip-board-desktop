import { serve } from '@hono/node-server';
import { app, BrowserWindow, ipcMain, Tray, Menu, Notification } from 'electron';
import { hono, setupSocket } from '../server/hono';
import { watcher } from '../clipboard/watcher';
import { join } from 'node:path';
import clipboard from 'clipboardy';
import { UserService } from '../services/User.service';
import { ClipboardService } from '../services/Clipboard.service';
import { store } from '../store';
import { getDevices } from '../services/Device.service';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1500,
        height: 1000,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: join(__dirname, "preload.js")
        }
    })

    win.loadFile(join(__dirname, "..", "renderer", "index.html"))
    win.webContents.openDevTools()

    return win
}

let tray
let isQuiting = false

app.whenReady().then(async () => {
    const win = createWindow()
    UserService.createUniqueUserToken()

    tray = new Tray(join(__dirname, "icon.jpg"))

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Ouvrir",
            click: () => win.show()
        },
        {
            label: "Quitter",
            click: () => {
                isQuiting = true
                app.quit()
            }
        }
    ])

    tray.setToolTip("Clipboard App")
    tray.setContextMenu(contextMenu)

    win.on("close", (event) => {
        if (!isQuiting) {
            console.log("On closed !")
            event.preventDefault()
            win.hide()
        }
    })

    // On peut utiliser les sockets pour vérifier quand le téléphone envoie une donnée dans le clipboard

    const server = serve({
        fetch: hono.fetch,
        port: 9876
    }, (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
    })

    setupSocket(server)

    ipcMain.on('request-data', (event) => {
        event.sender.send('response-data', { message: "Dernier texte : " + clipboard.readSync() })
    })

    ipcMain.on('window-close', () => {
        win.hide()
    })

    ipcMain.on('window-minimize', () => {
        win.minimize()
    })

    ipcMain.on('window-maximize', () => {
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    })

    ipcMain.handle("clipboard-data", async () => {
        return await ClipboardService.getDataToDB()
    })

    ipcMain.handle("get-token", async () => {
        return await UserService.getUniqueUserToken()
    })

    ipcMain.handle("toggle-incognito", () => {
        store.isIncognito = !store.isIncognito

        new Notification({
            title: "ClipboardX",
            body: store.isIncognito ? "Mode Incognito Activé" : "Mode Incognito Désactivé"
        }).show()

        return store.isIncognito
    })

    ipcMain.handle("is-incognito", () => {
        return store.isIncognito
    })

    ipcMain.handle("delete-data", async (_, id: string) => {
        const isDeleted = await ClipboardService.deleteClipboardEntry(id)

        new Notification({
            title: "ClipboardX",
            body: isDeleted ? "Données supprimées !" : "Erreur lors de la suppression"
        }).show()
    })

    ipcMain.handle("get-devices", async () => {
        return await getDevices()
    })

    ipcMain.handle("delete-all", async () => {
        const isDeleted = await ClipboardService.deleteAllToDB()

        new Notification({
            title: "ClipboardX",
            body: isDeleted ? "Toutes les données ont été supprimées !" : "Erreur lors de la suppression"
        }).show()
    })

    ipcMain.handle("write-to-clipboard", async (_, content: string) => {
        await ClipboardService.writeToClipboard(content)
    })

    await watcher()

})