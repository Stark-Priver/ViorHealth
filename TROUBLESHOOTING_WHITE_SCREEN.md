# 🔧 Fixing White Screen Issue

## Problem
The Electron app window is showing a white screen even though both servers are running.

## Root Cause
1. **Environment variable mismatch**: Frontend is trying to connect to `http://localhost:8000` but Django is running on `http://127.0.0.1:8000`
2. **Vite environment cache**: Changes to `.env` file require dev server restart
3. **CORS configuration**: Potential CORS issues between frontend and backend

## ✅ Solution Applied

### 1. Updated Environment Configuration
- Changed API URL from `localhost` to `127.0.0.1` in `.env`
- Added console logging to track API connection

### 2. Added Diagnostic Tool
- Created `test.html` for connection testing
- Access at: http://localhost:5173/test.html

### 3. Enhanced Logging
- Added API URL logging to `services/api.js`
- Check browser console for connection details

## 🚀 How to Fix

### Option 1: Restart the Dev Server (RECOMMENDED)

1. **Stop the current process:**
   ```powershell
   # Press Ctrl+C in the terminal running electron:dev
   # Or run this to kill all Node processes:
   Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
   ```

2. **Restart the app:**
   ```bash
   cd vior-health-frontend
   npm run electron:dev
   ```

3. **Check the console** in the Electron window (DevTools should be open)
   - Look for: `🔗 API Base URL: http://127.0.0.1:8000/api`
   - Check for any network errors

### Option 2: Test Connection First

1. **Open the diagnostic page** in the Electron window:
   - Navigate to: http://localhost:5173/test.html
   - Click "Test Backend Connection"
   - Click "Test API Endpoint"

2. **If tests pass**, navigate back to the main app
3. **If tests fail**, check the error messages for guidance

### Option 3: Manual Verification

1. **Verify Django is running:**
   ```bash
   # In PowerShell, check if port 8000 is in use:
   Get-NetTCPConnection -LocalPort 8000
   ```

2. **Test Django directly in browser:**
   - Open: http://127.0.0.1:8000/api/
   - Should see Django REST Framework page

3. **Check CORS:**
   - Django settings already has `CORS_ALLOW_ALL_ORIGINS = True`
   - This should allow all connections

## 🔍 Debugging Checklist

- [ ] Django server is running on port 8000
- [ ] Vite dev server is running on port 5173  
- [ ] Browser console shows correct API URL (127.0.0.1:8000)
- [ ] No CORS errors in console
- [ ] No 404 or 500 errors in Network tab
- [ ] DevTools is open to see console logs

## 📝 Expected Console Output

When the app loads correctly, you should see:
```
🔗 API Base URL: http://127.0.0.1:8000/api
🌍 Environment: development
```

## ⚠️ Common Issues

### White Screen Persists
- **Clear cache**: Hard reload (Ctrl+Shift+R) or clear browser cache
- **Check routing**: Ensure App.jsx routes are configured correctly
- **Verify React errors**: Check console for React component errors

### Network Errors
- **CORS**: Verify CORS_ALLOW_ALL_ORIGINS = True in Django settings
- **Port mismatch**: Ensure frontend connects to correct backend port
- **Firewall**: Check if Windows Firewall is blocking connections

### Backend Not Responding
- **Check migrations**: Run `python manage.py migrate`
- **Check for errors**: Look at Django terminal output
- **Restart Django**: Kill process and restart manually if needed

## 🎯 Next Steps

1. **Stop current Electron app**
2. **Restart with**: `npm run electron:dev`
3. **Check console logs** for API connection confirmation
4. **If still white screen**, navigate to: http://localhost:5173/test.html

---

**Quick Command to Restart:**
```powershell
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force; Set-Location f:\PROJECTS\ViorHealth\vior-health-frontend; npm run electron:dev
```
