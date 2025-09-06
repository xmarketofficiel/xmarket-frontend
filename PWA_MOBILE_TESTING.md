# 📱 PWA Mobile Testing Guide

## How to Test XMarket PWA Installation on Your Phone

### 🔧 Setup Steps:

#### For Regular Development (No PWA warnings):
```bash
cd Front-end && npm run dev
```
Server runs on: `http://localhost:3002` (PWA disabled, no warnings)

#### For PWA Testing:
```bash
cd Front-end && npm run dev:pwa
```
Server runs with PWA enabled for mobile testing

### 📱 Testing on Mobile:

#### For Android (Chrome):
1. **Start PWA development server:** `npm run dev:pwa`
2. **Open Chrome** on your Android phone
3. **Navigate to:** `http://10.32.132.92:3002` (use your computer's IP)
4. **Look for install options:**
   - Chrome may show a banner "Add XMarket to Home Screen"
   - Or check Chrome menu (⋮) → "Install app" or "Add to Home Screen"
5. **Use the test button:**
   - You'll see a blue phone icon (📱) in the top-right corner
   - Tap it to open the PWA Test Panel
   - Check the status and try the "Install App" button

#### For iOS (Safari):
1. **Start PWA development server:** `npm run dev:pwa`
2. **Open Safari** on your iPhone
3. **Navigate to:** `http://10.32.132.92:3002` (use your computer's IP)
4. **Install via Safari menu:**
   - Tap the Share button (⬆️) at the bottom
   - Scroll down and tap "Add to Home Screen"
   - Customize the name and tap "Add"
5. **Use the test button:**
   - You'll see a blue phone icon (📱) in the top-right corner
   - Tap it to check the PWA status

### ✅ What You Should See:

#### PWA Test Panel Features:
- **Status indicator:** Shows if the app is ready to install
- **Device info:** Shows your browser and device details
- **Install button:** Manual trigger for installation
- **Instructions:** Built-in testing guide

#### Signs PWA is Working:
1. **Service worker registered** (check browser dev tools)
2. **Manifest.json loaded** (check network tab)
3. **Install prompt appears** (automatically or via test button)
4. **App icon visible** on your home screen after installation

### 🚀 After Installation:
- **Launch from home screen** - should open in standalone mode (no browser UI)
- **Offline functionality** - basic caching should work
- **App-like experience** - full screen, app switcher shows "XMarket"

### 🔍 Troubleshooting:
1. **No install prompt?**
   - Make sure you're using Chrome/Safari
   - Check that PWA requirements are met (HTTPS not required for localhost)
   - Try refreshing the page

2. **Can't access from phone?**
   - Make sure both devices are on the same WiFi network
   - Check if your computer's firewall is blocking the port
   - Try using the computer's actual IP address

3. **Test panel shows "Waiting for Install Prompt"?**
   - This is normal - the browser decides when to show the prompt
   - You can still try installing via browser menu
   - The automatic prompt may appear after some user interaction

### 📋 Features to Test:
- ✅ **Home screen installation**
- ✅ **Standalone mode launch** 
- ✅ **Offline functionality** (try disconnecting internet)
- ✅ **App shortcuts** (if supported by your device)
- ✅ **Full screen experience**

---
**Note:** The PWA test button (📱) is only for development testing and should be removed in production.
