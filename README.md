# Monkeytype for Visual Studio Code

Quickly practice typing tests on [Monkeytype](https://monkeytype.com) right inside Visual Studio Code's integrated browser.

---

## ✨ Features

- **Integrated Browser Experience**: Opens `https://monkeytype.com` inside VS Code using the built-in Simple Browser without leaving your coding environment.
- **Left Sidebar (Activity Bar) Entry**: Access Monkeytype directly from the left Activity Bar icon whenever you want to practice.
- **Status Bar Quick-Action**: An unobtrusive `$(keyboard) Monkeytype` button on the bottom status bar for 1-click access.
- **Full Settings Persistence**: Themes, custom caret styles, sound effects, test durations, and account logins persist automatically across VS Code sessions using native browser storage (`localStorage` and `IndexedDB`).
- **Resilient Fallback**: If the integrated browser is unavailable or disabled, it safely falls back to your operating system's default external browser.
- **Zero Dependencies & Zero Setup**:
  - No `npm install` needed
  - No build step or TypeScript compiler required
  - Pure native JavaScript running directly on VS Code's Extension Host
  - No Monkeytype API calls or account credentials required
  - No scraping or telemetry

---

## 🚀 How to Use

You can launch Monkeytype in three convenient ways:

1. **From the Command Palette**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
   - Type **`Monkeytype: Open Monkeytype`** and press `Enter`.
2. **From the Left Sidebar (Activity Bar)**:
   - Click the **Monkeytype** icon on the left Activity Bar.
   - Click **Open Monkeytype** in the sidebar view or the globe icon in the sidebar header.
3. **From the Status Bar**:
   - Click the `$(keyboard) Monkeytype` button at the bottom right of the window.

> **💡 Typing Tip**: When typing in the integrated browser, click anywhere inside the Monkeytype webview to ensure it has keyboard focus. This prevents global VS Code shortcuts (such as `Ctrl+P` or `Ctrl+W`) from capturing your keystrokes during a test.

---

## ⚙️ How It Works & Browser Limitations

1. **Integrated Browser (`Simple Browser`)**:
   - The extension utilizes VS Code's internal `simpleBrowser.api.open` and `simpleBrowser.show` commands provided by the built-in `vscode.simple-browser` extension.
   - The integrated browser runs within VS Code's Chromium/Electron environment, enabling web application features such as audio, storage, and smooth rendering.
2. **Safe Fallback**:
   - If you are running an environment where built-in extensions are disabled or unbundled, the extension automatically calls `vscode.env.openExternal` to open Monkeytype in your default web browser (Chrome, Firefox, Edge, Safari, etc.) and displays an informational notice.
3. **Offline Requirement**:
   - Monkeytype is a web application; an active internet connection is required to load the page.

---

## 🛠️ Running & Installing

Because this extension is written in pure native JavaScript for VS Code's Extension Host, **nothing needs to be installed on your system**.

### Option 1: Run via F5 in VS Code (Development)
1. Open this folder in Visual Studio Code (`File > Open Folder...`).
2. Press `F5` (or go to `Run and Debug` and click `Run Extension`).
3. A new VS Code Extension Development Host window will open with Monkeytype ready to use!

### Option 2: Install Permanently in Your VS Code
To have the extension permanently available in your everyday VS Code without compiling or packaging, copy this folder into your VS Code extensions directory:

**Windows (PowerShell):**
```powershell
Copy-Item -Path "c:\Users\mridul.chandrawanshi\Downloads\Projects\Antigravity\MonkeyTypeVSCodeExtension" -Destination "$env:USERPROFILE\.vscode\extensions\monkeytype-vscode" -Recurse
```

**macOS & Linux (Terminal):**
```bash
cp -r /path/to/MonkeyTypeVSCodeExtension ~/.vscode/extensions/monkeytype-vscode
```

> **💡 Tip (Symlink):** If you prefer not to copy files, you can create a symbolic link so any local edits update instantly:
> - **macOS / Linux:** `ln -s "$(pwd)" ~/.vscode/extensions/monkeytype-vscode`
> - **Windows (PowerShell as Admin):** `New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.vscode\extensions\monkeytype-vscode" -Target (Get-Location)`

After copying or linking, restart VS Code. The Monkeytype icon will appear on your left Activity Bar!

---

## 📄 License
MIT
