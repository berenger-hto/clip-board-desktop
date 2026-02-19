import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    requestData: () => ipcRenderer.send('request-data'),
    onData: (callback: (data: any) => void) => ipcRenderer.on('response-data', (_, data) => callback(data)),
    windowControl: {
        close: () => ipcRenderer.send('window-close'),
        minimize: () => ipcRenderer.send('window-minimize'),
        maximize: () => ipcRenderer.send('window-maximize'),
    },
    clipboardData: () => ipcRenderer.invoke('clipboard-data'),
    getToken: () => ipcRenderer.invoke('get-token'),
    toggleIncognito: () => ipcRenderer.invoke('toggle-incognito'),
    isIncognito: () => ipcRenderer.invoke('is-incognito'),
    deleteData: (id: string) => ipcRenderer.invoke('delete-data', id)
})