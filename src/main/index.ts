import { serve } from '@hono/node-server';
import { app, BrowserWindow, ipcMain } from 'electron';
import { hono, setupSocket } from '../server/hono';
import { watcher } from '../clipboard/watcher';
import { join } from 'node:path';
import clipboard from 'clipboardy';
import { UserService } from '../services/User.service';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: join(__dirname, "preload.js")
        }
    })

    win.loadFile(join(__dirname, "..", "renderer", "index.html"))
    win.webContents.openDevTools()
    return win
}


app.whenReady().then(async () => {
    const win = createWindow()
    UserService.createUniqueUserToken(win)

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

    await watcher()

})