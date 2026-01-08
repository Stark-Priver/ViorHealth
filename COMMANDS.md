# 🚀 ViorHealth Desktop - Quick Commands

## Development
```bash
cd vior-health-frontend
npm run electron:dev        # Start desktop app (recommended)
npm run dev                # Frontend only
```

## Build & Distribution
```bash
# 1. Create icon first: build/icon.ico (required!)
# 2. Then build:
npm run electron:build:win  # Creates installer in release/ folder
```

## Common Issues

**Port in use:**
```powershell
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
```

**Reset everything:**
```bash
npm install
cd ../vior_health_backend
pip install -r requirements.txt
python manage.py migrate
```

## Files Created
- `electron/` - Main Electron files
- `ELECTRON_README.md` - Full docs
- `ELECTRON_QUICKSTART.md` - Getting started
- `ELECTRON_SETUP_COMPLETE.md` - This setup summary

## Status: ✅ READY!
The app is currently RUNNING in development mode.
Your Electron window should be open now!
