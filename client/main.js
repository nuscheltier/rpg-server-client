/**
 * main.js
 * Main file of the client. Using electron
 */

const {ipcMain, app, BrowserWindow} = require('electron'),
    net = require('net'),
    url = require('url'),
    path = require('path')

let win, serverCon
var playername

function createWindow() {
    win = new BrowserWindow({height: 600, width: 800, autoHideMenuBar: true})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'html', 'index.html'),
        protocol: 'file:',
        slashes: 'true'
    }))
    //win.webContents.openDevTools()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})