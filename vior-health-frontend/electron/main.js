const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
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
  // Remove the application menu completely
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    frame: false, // Remove default window frame
    titleBarStyle: 'hidden',
    autoHideMenuBar: true, // Hide menu bar
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
  });

  // Handle maximize/unmaximize events
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-unmaximized');
  });
}

// Window control handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// Handle get printers
ipcMain.handle('get-printers', async () => {
  try {
    if (mainWindow && mainWindow.webContents) {
      const printers = await mainWindow.webContents.getPrintersAsync();
      return { success: true, printers };
    }
    return { success: false, error: 'Window not available' };
  } catch (error) {
    console.error('Error getting printers:', error);
    return { success: false, error: error.message };
  }
});

// Handle print receipt
ipcMain.handle('print-receipt', async (event, html) => {
  try {
    if (!mainWindow || !mainWindow.webContents) {
      return { success: false, error: 'Window not available' };
    }

    // Create a hidden window for printing
    const printWindow = new BrowserWindow({
      width: 302, // 80mm in pixels (80mm * 3.78 pixels/mm)
      height: 800,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Load the HTML content
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get available printers
    const printers = await printWindow.webContents.getPrintersAsync();
    
    // Find thermal printer (check for common thermal printer names)
    const thermalPrinter = printers.find(p => 
      p.name.toLowerCase().includes('thermal') ||
      p.name.toLowerCase().includes('receipt') ||
      p.name.toLowerCase().includes('pos') ||
      p.name.toLowerCase().includes('xprinter') ||
      p.name.toLowerCase().includes('epson')
    );

    // Print options
    const printOptions = {
      silent: false, // Show print dialog
      printBackground: true,
      margins: {
        marginType: 'none'
      },
      pageSize: {
        width: 80000, // 80mm in microns
        height: 200000 // Auto height
      }
    };

    // If thermal printer found, use it directly
    if (thermalPrinter) {
      printOptions.deviceName = thermalPrinter.name;
      printOptions.silent = true; // Don't show dialog for thermal printer
    }

    // Print
    await printWindow.webContents.print(printOptions);

    // Close the print window after a delay
    setTimeout(() => {
      printWindow.close();
    }, 1000);

    return { 
      success: true, 
      printer: thermalPrinter ? thermalPrinter.name : 'Default',
      availablePrinters: printers.length
    };
  } catch (error) {
    console.error('Error printing receipt:', error);
    return { success: false, error: error.message };
  }
});

async function initializeApp() {
  try {
    // Show splash screen
    createSplashWindow();
    
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
