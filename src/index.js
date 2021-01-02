const {
  app,
  BrowserWindow,
  dialog
} = require('electron');
const path = require('path');
const fetch = require('node-fetch');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // Remove the menu.
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Ignore SSL errors.
app.commandLine.appendSwitch('--ignore-certificate-errors');

// Check newer version.
fetch('https://api.github.com/repos/Matunknown/timetable-viewer/releases').then(res => res.json()).then(json => {
  const githubRelease = json[0].tag_name;
  if (githubRelease.replace(/\D/g, '') > app.getVersion().replace(/\D/g, '')) {
    const dialogOpts = {
      type: 'info',
      buttons: ['Télécharger', 'Plus tard'],
      title: 'Mise à jour',
      detail: 'Une nouvelle version du logiciel est disponible, vous pouvez la télécharger.'
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        require('electron').shell.openExternal('https://github.com/Matunknown/timetable-viewer/releases/tag/' + githubRelease);
        app.quit();
      }
    });
  }
});