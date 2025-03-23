const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// ...existing code...

ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
});

// ...existing code...
