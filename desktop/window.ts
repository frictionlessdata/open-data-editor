import { shell, BrowserWindow } from 'electron'
import { resolve } from 'path'
import { is } from '@electron-toolkit/utils'

export function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    // ...(process.platform === 'linux' ? { icon } : {}),
    // webPreferences: {
    // preload: join(__dirname, '../preload/index.js'),
    // sandbox: false,
    // },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(resolve(__dirname, '../client/index.html'))
  }
}
