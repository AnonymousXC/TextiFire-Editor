const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');

let win, savepath;

function createWindow() {
    win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
        // title: 'My App',
    });

    // win.setTitle('My App');
    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



const menu_templete = [
    {
        label: "File",
        submenu: [
            {
                label:'New',
                click: () => {
                    win.webContents.send("new", null);
                }
            },
            {
                label: 'New Window',
                click: () => {
                    createWindow();
                }
            },
            {
                label: 'Open...',
                click: () => {
                    const filepath = dialog.showOpenDialogSync(win, {
                        properties: ['openFile']
                    });
                    if(filepath){
                        win.webContents.send("open_file" , filepath[0]);
                        savepath = filepath[0];
                    }
                }
            },
            {
                label: 'Save',
                click: () => {
                    if(!savepath){
                        savepath = dialog.showSaveDialogSync(win, {
                            properties: ['saveFile']
                        });
                    }
                    win.webContents.send('save_file', savepath);
                }
            },
            {
                label: 'Save As',
                click: () => {
                    savepath = dialog.showSaveDialogSync(win, {
                        properties: ['saveFile']
                    });
                }
            },
            {
                type: 'separator',
            },
            {
                label: 'Print',
                click: () => {
                    win.webContents.print();
                }
            },
            {
                label: 'Print Setup...',
                click: () => {
                    win.webContents.print();
                }
            },
            {
                type: 'separator',
            },
            {
                role: 'close',
            },
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo',
            },
            {
                role: 'redo',
            },
            {
                type: 'separator',
            },
            {
                role: 'cut',
            },
            {
                role: 'copy',
            },
            {
                role: 'paste',
            },
            {
                role: 'delete',
            },
            {
                type: 'separator',
            },
            {
                label: 'Search With Google...',
                click: () => {
                    win.webContents.send('search_gog', null);
                }
            },
            {
                label: 'Find...',
                click: () => {
                    const findWindow = new BrowserWindow({
                        height: 300,
                        width: 400,
                        webPreferences: {
                            nodeIntegration: true,
                            enableRemoteModule: true,
                            contextIsolation: false
                        },
                        // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
                        // title: 'My App',
                    });
                    findWindow.removeMenu();
                    findWindow.webContents.openDevTools();
                    findWindow.setTitle('My App');
                    findWindow.loadFile(path.join(__dirname, './find/find.html'));
                    ipcMain.on('find', (event, word) => {
                        win.webContents.send('find_word', word);
                        findWindow.close();
                        win.focus();
                    })
                }
            },
            {
                label: 'Find Next',
            },
            {
                label: 'Find Previous',
            },
            {
                label: 'Replace',
            },
            {
                label: 'Go To...',
            },
            {
                type: 'separator',
            },
            {
                label: 'Select All',
            },
            {
                label: 'Time/Date',
            },
        ]
    },
    {
        label: 'Format',
        submenu: [
            {
                label: 'Word Wrap',
            },
            {
                label: 'Font...',
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Zoom',
                submenu: [
                    {
                        role: 'zoomin',
                    },
                    {
                        role: 'zoomout',
                    },
                    {
                        role: 'resetzoom',
                    },
                ],
            },
            {
                label: 'Status Bar',
            },
            {
                label: 'Spilt 1',
                click: () => {
                    win.webContents.send('single_editor', null);
                }
            },
            {
                label: 'Split 2',
                click: () => {
                    win.webContents.send('double_editor', null);
                }
            }
        ]
    },
    {
        label: 'Settings',
        submenu: [
            {
                label: 'Open Settings',
                click: () => {
                    const settingsWindow = new BrowserWindow({
                        height: 400,
                        width: 400,
                        alwaysOnTop: true,
                        webPreferences: {
                            nodeIntegration: true,
                            enableRemoteModule: true,
                            contextIsolation: false
                        },
                        // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
                        // title: 'My App',
                    });
                    settingsWindow.removeMenu();
                    settingsWindow.webContents.openDevTools();
                    settingsWindow.setTitle('My App');
                    settingsWindow.loadFile(path.join(__dirname, './src/settings/settings.html'));
                    ipcMain.on('settings', (event, settings) => {
                        win.webContents.send('change_settings', settings);
                    })
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'View Help',
            },
            {
                label: 'Send Feedback',
            },
            {
                type: 'separator',
            },
            {
                label: 'About Noter!',
            },
        ]
    }
];

const menu = Menu.buildFromTemplate(menu_templete);
Menu.setApplicationMenu(menu);