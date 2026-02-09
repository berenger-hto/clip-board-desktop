import { serve } from '@hono/node-server';
import { app, BrowserWindow, ipcMain } from 'electron';
import { hono } from '../server/hono';
import { watcher } from '../clipboard/watcher';
import path, { join } from 'node:path';
import clipboard from 'clipboardy';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, "preload.js")
        }
    })

    win.loadFile(join(__dirname, "..", "renderer", "index.html"))
}

app.whenReady().then(() => {
    createWindow()
    serve({
        fetch: hono.fetch,
        port: 3000
    }, (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
    })

    ipcMain.on('request-data', (event) => {
        event.sender.send('response-data', { message: "Dernier texte : " + clipboard.readSync() })
    })

    console.log("Path", join(__dirname, "..", "..", "db", "app.db"))

    watcher()

})