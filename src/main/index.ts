import { serve } from '@hono/node-server';
import { app, BrowserWindow, ipcMain, Tray, Menu, Notification, clipboard, nativeImage } from 'electron';
import { join } from 'node:path';
import { hono, setupSocket } from '../server/hono';
import { watcher } from '../clipboard/watcher';
import { UserService } from '../services/User.service';
import { ClipboardService } from '../services/Clipboard.service';
import { store } from '../store';
import { getDevices } from '../services/Device.service';
import type { FilterItem } from '../types/types';

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
    // win.webContents.openDevTools()

    return win
}

let tray
let isQuiting = false

app.whenReady().then(async () => {
    app.setName('clip-board-x')
    UserService.createUniqueUserToken()
    const win = createWindow()

    const icon = nativeImage.createFromPath(join(__dirname, "icon.png")).resize({ width: 32, height: 32, quality: "best" })
    tray = new Tray(icon)

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

    const server = serve({
        fetch: hono.fetch,
        port: 9876
    }, (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
    })

    setupSocket(server)

    ipcMain.on('request-data', (event) => {
        event.sender.send('response-data', { message: "Dernier texte : " + clipboard.readText() })
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

    ipcMain.handle("find-with-filter", async (_, filterItemType: FilterItem) => {
        return await ClipboardService.findWithFilterDesktop(filterItemType)
    })

    ipcMain.handle("find-with-search", async (_, searchTerm: string) => {
        return await ClipboardService.find(searchTerm)
    })

    ipcMain.handle("toggle-favorite", async (_, id) => {
        return await ClipboardService.toggleFavorite(id)
    })

    await watcher()

})
