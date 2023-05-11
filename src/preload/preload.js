const { contextBridge, ipcRenderer } = require('electron')

// Setup IPC in the preload script here instead of exposing electron APIs in the renderer process
// https://www.electronjs.org/docs/latest/tutorial/ipc
contextBridge.exposeInMainWorld('electronApi', {
  // Messages to send to the main process
  beginDownload: (data) => ipcRenderer.send('beginDownload', data),
  chooseDownloadLocation: () => ipcRenderer.send('chooseDownloadLocation'),
  clearDefaultDownload: () => ipcRenderer.send('clearDefaultDownload'),

  // Messages to be received by the renderer process
  initializeDownload: (on, callback) => ipcRenderer[on ? 'on' : 'off']('initializeDownload', callback),
  setDownloadLocation: (on, callback) => ipcRenderer[on ? 'on' : 'off']('setDownloadLocation', callback),

  // System values for renderer
  isMac: process.platform === 'darwin'
})
