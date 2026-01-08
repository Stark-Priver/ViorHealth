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
  
  // You can add more secure IPC methods here as needed
  // Example:
  // sendMessage: (channel, data) => {
  //   const validChannels = ['toMain'];
  //   if (validChannels.includes(channel)) {
  //     ipcRenderer.send(channel, data);
  //   }
  // },
  // receiveMessage: (channel, func) => {
  //   const validChannels = ['fromMain'];
  //   if (validChannels.includes(channel)) {
  //     ipcRenderer.on(channel, (event, ...args) => func(...args));
  //   }
  // },
});
