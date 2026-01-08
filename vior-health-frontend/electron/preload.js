const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,
  
  // Version information
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },

  // App information
  isElectron: true,
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // Listen for window state changes
  onMaximizeChange: (callback) => {
    ipcRenderer.on('window-maximized', () => callback(true));
    ipcRenderer.on('window-unmaximized', () => callback(false));
  },
});
