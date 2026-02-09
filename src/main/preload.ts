import clipboard from "clipboardy";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    requestData: () => ipcRenderer.send('request-data'),
    onData: (callback: (data: any) => void) => ipcRenderer.on('response-data', (_, data) => callback(data)),
})