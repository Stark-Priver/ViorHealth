const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { startBackendServer, stopBackendServer } = require('./backend-manager');

let mainWindow;
let splashWindow;
let backendProcess = null;

const isDev = process.env.NODE_ENV === 'development';
const FRONTEND_URL = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'ViorHealth - Healthcare Management System',
    backgroundColor: '#ffffff',
    show: false, // Don't show until ready
  });

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    // Close splash screen
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
  });

  // Load the frontend
  if (isDev) {
    mainWindow.loadURL(FRONTEND_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });how splash screen
    createSplashWindow();
    
    // S
}

async function initializeApp() {
  try {
    // Start Django backend server
    console.log('Starting Django backend server...');
    backendProcess = await startBackendServer();
    
    if (!backendProcess) {
      throw new Error('Failed to start backend server');
    }

    console.log('Backend server started successfully');
    
    // Wait a bit for the server to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create the main window
    await createWindow();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    dialog.showErrorBox(
      'ViorHealth - Initialization Error',
      `Failed to start the application:\n\n${error.message}\n\nPlease check that all dependencies are installed correctly.`
    );
    
    app.quit();
  }
}

// App event handlers
app.whenReady().then(initializeApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', async (event) => {
  if (backendProcess) {
    event.preventDefault();
    console.log('Stopping backend server...');
    await stopBackendServer(backendProcess);
    backendProcess = null;
    app.quit();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox(
    'ViorHealth - Error',
    `An unexpected error occurred:\n\n${error.message}`
  );
});
