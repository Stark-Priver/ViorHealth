# ViorHealth - Electron Desktop Application

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+ with pip
- Git

### Getting Started

1. **Install Frontend Dependencies**
   ```bash
   cd vior-health-frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd ../vior_health_backend
   pip install -r requirements.txt
   ```

3. **Setup Database**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

## Running the Application

### Development Mode

Run the Electron app in development mode (automatically starts both frontend and backend):

```bash
cd vior-health-frontend
npm run electron:dev
```

This will:
- Start Vite dev server on http://localhost:5173
- Start Django backend on http://127.0.0.1:8000
- Launch Electron window with hot reload enabled

### Production Build

To create a Windows installer:

1. **Prepare Icons** (Important!)
   - Place your `icon.ico` file in the `build/` folder
   - Recommended size: 256x256 or higher with multiple embedded sizes

2. **Build the Application**
   ```bash
   npm run electron:build:win
   ```

This will:
- Build the React frontend for production
- Bundle the Django backend
- Create a Windows installer in the `release/` folder

The installer will be named: `ViorHealth-Setup-1.0.0.exe`

## Project Structure

```
vior-health-frontend/
├── electron/                 # Electron main process files
│   ├── main.js              # Main Electron process
│   ├── preload.js           # Preload script for security
│   └── backend-manager.js   # Django backend management
├── build/                    # Build assets
│   ├── icon.ico             # Windows application icon
│   └── license.txt          # Software license
├── dist/                     # Production build output
├── release/                  # Installer output
├── src/                      # React application source
└── scripts/                  # Build scripts
    └── bundle-backend.py    # Backend bundling script
```

## Features

✅ **Professional Desktop Experience**
- Native window controls
- System tray integration ready
- Desktop notifications support
- Auto-updates ready (can be configured)

✅ **Automatic Backend Management**
- Django server starts automatically
- Graceful shutdown on app close
- Port conflict detection
- Error handling and logging

✅ **Secure Architecture**
- Context isolation enabled
- No node integration in renderer
- Preload script for safe IPC
- Web security enabled

✅ **Cross-Platform Ready**
- Built with Electron
- Can be extended to macOS and Linux
- Consistent UI across platforms

## Available Scripts

### Development
- `npm run dev` - Start Vite dev server only
- `npm run electron:dev` - Run full Electron app in dev mode

### Building
- `npm run build` - Build frontend only
- `npm run electron:build` - Build for current platform
- `npm run electron:build:win` - Build Windows installer

### Other
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Configuration

### Backend Settings
Edit `electron/backend-manager.js` to configure:
- Backend port (default: 8000)
- Backend host (default: 127.0.0.1)
- Startup timeout
- Python executable path

### Electron Settings
Edit `electron/main.js` to configure:
- Window size and behavior
- Dev tools (enabled in dev mode)
- Security policies
- Icon and title

### Build Settings
Edit `package.json` under the `build` section to configure:
- Application ID
- Product name
- File inclusion/exclusion
- Installer options (NSIS)
- Code signing (for production)

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
- The app will detect and attempt to use the existing server
- Or change the port in `backend-manager.js`

### Backend Won't Start
Check:
1. Python is installed and in PATH
2. All dependencies are installed: `pip install -r requirements.txt`
3. Database migrations are run: `python manage.py migrate`
4. No syntax errors in Python code

### Electron Won't Launch
Check:
1. Node modules installed: `npm install`
2. Frontend builds successfully: `npm run build`
3. Check console for errors

### Build Fails
Common issues:
1. Missing icon files in `build/` folder
2. Backend path incorrect
3. Python dependencies not installed
4. Disk space insufficient

## Production Deployment

### Before Release:
1. ✅ Update version in `package.json`
2. ✅ Add professional icon (icon.ico)
3. ✅ Test the application thoroughly
4. ✅ Update license.txt if needed
5. ✅ Create installer signing certificate (for trusted installation)
6. ⚠️ Configure auto-updates (optional)
7. ⚠️ Set up error reporting (optional)

### Distribution:
1. Build the installer: `npm run electron:build:win`
2. Test the installer on a clean Windows machine
3. Sign the installer with a code signing certificate (recommended)
4. Upload to your distribution server/store
5. Create release notes

## Security Considerations

- ✅ Context isolation enabled
- ✅ No remote code execution
- ✅ Secure IPC communication
- ✅ Web security enabled
- ⚠️ Add HTTPS for production API calls
- ⚠️ Implement user authentication
- ⚠️ Encrypt sensitive data
- ⚠️ Regular security updates

## Future Enhancements

Potential additions:
- Auto-update functionality (using electron-updater)
- System tray with quick actions
- Native notifications
- Offline mode support
- Database backup/restore
- Multi-language support
- macOS and Linux builds
- Crash reporting
- Analytics integration

## Support

For issues and questions:
- Check the GitHub Issues
- Review the documentation
- Contact: support@viorhealth.com

---

**Note**: This is a desktop application wrapper for the ViorHealth web application. Make sure to keep both frontend and backend code in sync during development.
