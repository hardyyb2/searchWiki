const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const readSearch = require(`./readSearch.js`)
const { app, BrowserWindow, ipcMain } = electron

let createWindow = () => {
  let mainWindow

  let state = windowStateKeeper({
    defaultHeight: 600,
    defaultWidth: 1000
  })
  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    minHeight: 400,
    minWidth: 600,
    width: state.width,
    height: state.height,

    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  state.manage(mainWindow)
  // mainWindow.webContents.openDevTools()
  mainWindow.loadFile(`renderer/main.html`)
}

app.on(`ready`, createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

ipcMain.on(`search-item`, (e, url) => {
  readSearch(url, item => {
    e.sender.send(`search-item-success`, item)
  })
})
