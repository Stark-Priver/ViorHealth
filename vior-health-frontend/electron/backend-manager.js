const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

const isDev = process.env.NODE_ENV === 'development';
const BACKEND_PORT = 8000;
const BACKEND_HOST = '127.0.0.1';

/**
 * Check if a port is available
 */
function checkPort(port, host = 'localhost') {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port is in use
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // Port is available
    });
    
    server.listen(port, host);
  });
}

/**
 * Wait for the server to be ready
 */
function waitForServer(port, host, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkConnection = () => {
      const socket = new net.Socket();
      
      socket.setTimeout(1000);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.once('timeout', () => {
        socket.destroy();
        retry();
      });
      
      socket.once('error', () => {
        retry();
      });
      
      socket.connect(port, host);
    };
    
    const retry = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Backend server did not start within ${timeout}ms`));
      } else {
        setTimeout(checkConnection, 500);
      }
    };
    
    checkConnection();
  });
}

/**
 * Start the Django backend server
 */
async function startBackendServer() {
  try {
    // Check if port is already in use
    const portAvailable = await checkPort(BACKEND_PORT, BACKEND_HOST);
    if (!portAvailable) {
      console.log(`Port ${BACKEND_PORT} is already in use. Attempting to use existing server...`);
      
      // Wait to see if the existing server responds
      try {
        await waitForServer(BACKEND_PORT, BACKEND_HOST, 5000);
        console.log('Using existing backend server');
        return { pid: 'existing' }; // Return a marker for existing server
      } catch (error) {
        throw new Error(`Port ${BACKEND_PORT} is in use but server is not responding`);
      }
    }

    let pythonPath;
    let backendPath;
    let managePath;

    if (isDev) {
      // Development mode: use local Python and backend folder
      backendPath = path.join(__dirname, '../../vior_health_backend');
      managePath = path.join(backendPath, 'manage.py');
      
      // Try to find Python executable
      pythonPath = 'python'; // Will use system Python
    } else {
      // Production mode: use bundled Python and backend
      const resourcesPath = process.resourcesPath;
      backendPath = path.join(resourcesPath, 'backend');
      managePath = path.join(backendPath, 'manage.py');
      pythonPath = path.join(resourcesPath, 'python', 'python.exe');
      
      // Check if bundled Python exists
      if (!fs.existsSync(pythonPath)) {
        throw new Error('Bundled Python not found. Please reinstall the application.');
      }
    }

    // Check if manage.py exists
    if (!fs.existsSync(managePath)) {
      throw new Error(`Backend manage.py not found at: ${managePath}`);
    }

    console.log(`Starting Django server from: ${backendPath}`);
    console.log(`Using Python: ${pythonPath}`);

    // Start Django development server
    const serverProcess = spawn(
      pythonPath,
      ['manage.py', 'runserver', `${BACKEND_HOST}:${BACKEND_PORT}`, '--noreload'],
      {
        cwd: backendPath,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1',
          DJANGO_SETTINGS_MODULE: 'vior_health_backend.settings',
        },
        shell: true,
      }
    );

    // Handle server output
    serverProcess.stdout.on('data', (data) => {
      console.log(`[Django] ${data.toString().trim()}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Django Error] ${data.toString().trim()}`);
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start Django server:', error);
    });

    serverProcess.on('close', (code) => {
      console.log(`Django server exited with code ${code}`);
    });

    // Wait for the server to be ready
    console.log('Waiting for Django server to be ready...');
    await waitForServer(BACKEND_PORT, BACKEND_HOST);
    console.log('Django server is ready!');

    return serverProcess;
  } catch (error) {
    console.error('Error starting backend server:', error);
    throw error;
  }
}

/**
 * Stop the backend server
 */
async function stopBackendServer(serverProcess) {
  if (!serverProcess || serverProcess.pid === 'existing') {
    return; // Don't stop if we're using an existing server
  }

  return new Promise((resolve) => {
    if (serverProcess.killed) {
      resolve();
      return;
    }

    serverProcess.once('close', () => {
      console.log('Django server stopped');
      resolve();
    });

    // Try graceful shutdown first
    serverProcess.kill('SIGTERM');

    // Force kill after 5 seconds if still running
    setTimeout(() => {
      if (!serverProcess.killed) {
        console.log('Force killing Django server...');
        serverProcess.kill('SIGKILL');
      }
    }, 5000);
  });
}

module.exports = {
  startBackendServer,
  stopBackendServer,
  BACKEND_PORT,
  BACKEND_HOST,
};
