@echo off
title Kamikura Print Server
echo ========================================
echo  KAMIKURA PRINT SERVER
echo ========================================
echo.

node print-server.js

pause
```

---

## **Installation Steps:**

### **1. Install Node.js**
Download and install from: https://nodejs.org/ (LTS version)

### **2. Setup the print server**
1. Copy all files to `C:\kamikura-print-server\`
2. Edit `config.json`:
   - Update `base_url` to your actual domain
   - Update `api_key` to match your API key
3. Double-click `install.bat`
4. Wait for dependencies to install

### **3. Start the server**
Double-click `start.bat`

You should see:
```
╔════════════════════════════════════════════════════╗
║     KAMIKURA RESTAURANT - PRINT SERVER v1.0       ║
╚════════════════════════════════════════════════════╝

[2024-12-25T14:30:00.000Z] [INFO] Print server starting...
[2024-12-25T14:30:00.000Z] [INFO] API: https://kamikuralk.online/api
[2024-12-25T14:30:00.000Z] [INFO] Poll interval: 2000ms
[2024-12-25T14:30:00.000Z] [INFO] ✓ Print server running. Press Ctrl+C to stop.