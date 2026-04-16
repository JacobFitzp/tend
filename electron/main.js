const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

function resolveIcon() {
  const base = app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
  if (process.platform === 'darwin') {
    return path.join(base, 'build', 'icon.icns');
  }
  return path.join(base, 'build', 'icon.png');
}

function createWindow() {
  const icon = nativeImage.createFromPath(resolveIcon());

  const win = new BrowserWindow({
    width: 780,
    height: 860,
    minWidth: 520,
    minHeight: 600,
    title: 'Tend',
    icon,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(process.resourcesPath, 'out', 'index.html'));
  } else {
    win.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(nativeImage.createFromPath(resolveIcon()));
  }
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
