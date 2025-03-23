const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

// ...existing code...

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // ...existing window loading code...
}

// Add this IPC handler
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
})

// ...existing code...
