const {
  app,
  BrowserWindow,
  dialog,
  Menu
} = require('electron');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs')

const preferences = require(path.join(__dirname, 'preferences.json'));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    minWidth: 950,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Maximize window
  if (preferences['maximize']) mainWindow.maximize();

  if (preferences['fullscreen']) mainWindow.setFullScreen(true);

  // Menu
  const template = [{
      label: 'Fichier',
      submenu: [{
        role: 'quit',
        label: 'Quitter'
      }]
    },
    {
      label: 'Affichage',
      submenu: [{
          role: 'reload',
          label: 'Actualiser'
        },
        {
          type: 'separator'
        },
        {
          role: 'zoomIn',
          label: 'Zoom avant'

        },
        {
          role: 'zoomOut',
          label: 'Zoom arrière'
        },
        {
          role: 'resetZoom',
          label: 'Réinitialiser le zoom'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen',
          label: 'Plein écran'
        }
      ]
    },
    ...(process.platform !== 'darwin' ? [{
      label: 'Préférences',
      submenu: [{
          label: 'Maximiser à l\'ouverture',
          type: 'checkbox',
          checked: preferences['maximize'],
          click: async () => {
            if (preferences['maximize']) {
              preferences['maximize'] = false;
            } else {
              preferences['maximize'] = true;
            }
            fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), (err) => {
              if (err) console.log(err)
            });
          }
        },
        {
          label: 'Plein écran à l\'ouverture',
          type: 'checkbox',
          checked: preferences['fullscreen'],
          click: async () => {
            if (preferences['fullscreen']) {
              preferences['fullscreen'] = false;
            } else {
              preferences['fullscreen'] = true;
            }
            fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), (err) => {
              if (err) console.log(err)
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Vérifier les mises à jour',
          type: 'checkbox',
          checked: preferences['checkUpdate'],
          click: async () => {
            if (preferences['checkUpdate']) {
              preferences['checkUpdate'] = false;
            } else {
              preferences['checkUpdate'] = true;
            }
            fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), (err) => {
              if (err) console.log(err)
            });
          }
        }
      ]
    }] : []),
    {
      role: 'help',
      label: 'Aide',
      submenu: [
        {
          label: 'Raccourcis',
          click: async () => {
            const dialogOpts = {
              type: 'info',
              buttons: ['Ok'],
              title: 'Raccourcis',
              detail: 'Flèche directionnelle gauche: Aller a la semaine précédente.\nFlèche directionnelle droite: Aller à la semaine suivante.'
            };
            dialog.showMessageBox(dialogOpts);
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'À propos de',
          click: async () => {
            const dialogOpts = {
              type: 'info',
              buttons: ['Ok'],
              title: app.getName(),
              detail: `Version: ${app.getVersion()}\nPlatform: ${process.platform}\n\nAuthor: Mat`
            };
            dialog.showMessageBox(dialogOpts);
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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
if (preferences['checkUpdate']) {
  fetch('https://api.github.com/repos/Matunknown/timetable-viewer/releases').then(res => res.json()).then(json => {
    const githubRelease = json[0].tag_name;
    if (githubRelease.replace(/\D/g, '') > app.getVersion().replace(/\D/g, '')) {
      const dialogOpts = {
        type: 'info',
        buttons: ['Plus tard', 'Télécharger'],
        title: 'Mise à jour',
        detail: 'Une nouvelle version du logiciel est disponible, vous pouvez la télécharger et l\'exécuter.'
      };

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 1) {
          let downloadUrl = 'https://github.com/Matunknown/timetable-viewer/releases/tag/' + githubRelease;

          if (process.platform === 'win32' && process.arch === 'x64') {
            downloadUrl = `https://github.com/Matunknown/timetable-viewer/releases/download/${githubRelease}/Timetable.Viewer-windows-64bit-${githubRelease}.exe`;
          } else if (process.platform === 'win32' && process.arch === 'ia32') {
            downloadUrl = `https://github.com/Matunknown/timetable-viewer/releases/download/${githubRelease}/Timetable.Viewer-windows-32bit-${githubRelease}.exe`;
          } else if (process.platform === 'linux') {
            downloadUrl = `https://github.com/Matunknown/timetable-viewer/releases/download/${githubRelease}/Timetable.Viewer-linux-64bit-${githubRelease}.tar.gz`;
          } else if (process.platform === 'darwin') {
            downloadUrl = `https://github.com/Matunknown/timetable-viewer/releases/download/${githubRelease}/Timetable.Viewer-macos-64bit-${githubRelease}.zip`;
          }

          require('electron').shell.openExternal(downloadUrl);
          app.quit();
        }
      });
    }
  });
}