import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initLocale } from '@locale/index'
import { BrowserWindow, app, dialog } from 'electron'
import log from 'electron-log'
import { join } from 'path'
import { createBridge } from './bridge'
import { createContextMenu } from './context'
import { createMenu } from './menu'
import * as settings from './settings'
import { createWindow } from './window'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  initLocale()

  log.info('# Start application')
  electronApp.setAppUserModelId(settings.APP_USER_MODEL_ID)

  log.info('## Start client')
  createBridge()
  const mainWindow = await createWindow()
  createMenu(mainWindow)
  createContextMenu(mainWindow)
})

// Default open or close DevTools by F12 in development
// and ignore CommandOrControl + R in production.
// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// For convinience, we catch all unhandled rejections here
// instead of wrapping all individual async functions with try/catch
process.on('unhandledRejection', async (error: any) => {
  log.error(error)
  await dialog.showMessageBox({
    type: 'error',
    title: 'Open Data Editor',
    message: 'Fatal error',
    detail: error.toString(),
  })
  app.quit()
})

app.setAboutPanelOptions({
  applicationName: 'Open Data Editor',
  applicationVersion: '1.0.0',
  website: 'https://opendataeditor.okfn.org/',
  iconPath: './client/assets/ODE_sidebar_logo.svg',
})

// Configure logger to write to the app directory
log.transports.file.resolvePath = () => join(settings.APP_HOME, 'logger', 'main.log')
