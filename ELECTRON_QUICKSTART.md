# ViorHealth Desktop Application - Quick Start Guide

## 🚀 Quick Start

### For Development:

1. **First Time Setup:**
   ```bash
   # Install dependencies
   cd vior-health-frontend
   npm install

   # Setup backend
   cd ../vior_health_backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   ```

2. **Run the Desktop App:**
   ```bash
   cd vior-health-frontend
   npm run electron:dev
   ```

### For Production Build:

1. **Create Application Icons:**
   - Option A: Use the icon generator script
     ```bash
     generate-icons.bat
     ```
   - Option B: Manually create `build/icon.ico` using an online converter

2. **Build Windows Installer:**
   ```bash
   npm run electron:build:win
   ```

3. **Find your installer:**
   - Location: `vior-health-frontend/release/`
   - File: `ViorHealth-Setup-1.0.0.exe`

## 📦 What You Get

- ✅ Professional Windows desktop application
- ✅ Automatic Django backend server management
- ✅ Native Windows installer (NSIS)
- ✅ Desktop shortcut and Start Menu entry
- ✅ Auto-starting backend on app launch
- ✅ Clean shutdown on app close

## 🎯 Features

- **Single Executable**: One installer includes everything
- **No Browser Required**: Runs as native Windows app
- **Auto Backend**: Django server starts automatically
- **Professional UI**: Native window controls and styling
- **Easy Install**: Standard Windows installer experience

## 📝 Important Notes

- Default backend port: 8000
- Default frontend port (dev): 5173
- Icons required for production build
- Python must be installed for development mode
- See ELECTRON_README.md for detailed documentation

## 🔧 Troubleshooting

**App won't start:**
- Check if Python is installed
- Verify backend dependencies: `pip install -r requirements.txt`
- Run migrations: `python manage.py migrate`

**Build fails:**
- Ensure icon.ico exists in build/ folder
- Check disk space
- Verify all dependencies installed

**Port conflicts:**
- Change port in electron/backend-manager.js
- Close other apps using port 8000

## 📚 Next Steps

1. Read ELECTRON_README.md for complete documentation
2. Customize icons with your branding
3. Test the app thoroughly
4. Build and distribute!

---

**Need Help?** Check the full documentation in ELECTRON_README.md
