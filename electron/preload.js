const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => {
            if (channel === 'select-directory') {
                return ipcRenderer.invoke(channel, ...args)
            }
        }
    }
})
