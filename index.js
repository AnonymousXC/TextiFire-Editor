const { app, BrowserWindow, ipcMain, Menu, dialog, globalShortcut } = require('electron');
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
     win.webContents.on('context-menu', (event) => {
          context_menu.popup();
     })
}

app.whenReady().then(createWindow);
app.whenReady().then(shortcuts);

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
                    },
                    accelerator: 'Ctrl + N',
               },
               {
                    label: 'New Window',
                    click: () => {
                         createWindow();
                    },
                    accelerator: 'Ctrl + Shift + N',
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
                    },
                    accelerator: 'Ctrl + O',
               },
               {
                    label: "Open Folder",
                    click: () => {
                         const folder_path = dialog.showOpenDialogSync(win, {
                              properties: ['openDirectory']
                         });
                         win.webContents.send("open_folder", folder_path);
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
                    },
                    accelerator: 'Ctrl + S',
               },
               {
                    label: 'Save As',
                    click: () => {
                         savepath = dialog.showSaveDialogSync(win, {
                              properties: ['saveFile']
                         });
                    },
                    accelerator: 'Ctrl + Shift + S',
               },
               {
                    type: 'separator',
               },
               {
                    label: 'Print',
                    click: () => {
                         win.webContents.print();
                    },
                    accelerator: 'Ctrl + P',
               },
               {
                    label: 'Print Setup...',
                    click: () => {
                         win.webContents.print();
                    },
                    accelerator: 'Ctrl + Shift + P',
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
                    },
                    accelerator: 'Ctrl + E',
               },
               {
                    label: 'Find...',
                    accelerator: 'Ctrl + F',
                    click: () => {
                         // const findWindow = new BrowserWindow({
                         //     height: 300,
                         //     width: 400,
                         //     webPreferences: {
                         //         nodeIntegration: true,
                         //         enableRemoteModule: true,
                         //         contextIsolation: false
                         //     },
                         //     // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
                         //     // title: 'My App',
                         // });
                         // findWindow.removeMenu();
                         // findWindow.webContents.openDevTools();
                         // findWindow.setTitle('My App');
                         // findWindow.loadFile(path.join(__dirname, './src/find/find.html'));
                         // ipcMain.on('find', (event, word) => {
                         //     win.webContents.send('find_word', word);
                         //     findWindow.close();
                         //     win.focus();
                         // })
                         win.webContents.send('find', null);
                    }
               },
               {
                    label: 'Replace',
                    accelerator: 'Ctrl + R',
                    click: () => {
                         win.webContents.send('replace', null);
                    }
               },
               {
                    label: 'Go To...',
                    accelerator: 'Ctrl + G',
                    click: () => {
                         win.webContents.send('goto', null);
                    }
               },
               {
                    type: 'separator',
               },
               {
                    label: 'Select All',
                    accelerator: 'Ctrl + A',
                    click: () => {
                         win.webContents.send('sel-all' , null);
                    }
               },
               {
                    label: 'Time/Date',
                    accelerator: 'F5',
                    click: () => {
                         win.webContents.send('dd_tt', null);
                    }
               },
          ]
     },
     {
          label: 'Format',
          submenu: [
               {
                    label: 'Word Wrap',
                    type: 'radio',
                    click: () => {
                         win.webContents.send('wrap_word' , null);
                    }
               },
               {
                    label: 'Unwrap Word',
                    type: 'radio',
                    checked: true,
                    click: () => {
                         win.webContents.send('unwrap_word' , null);
                    }
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
                         function setting_win() {
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
                         setting_win();
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


const context_menu_temp = [
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
          type: 'separator',
     },
     {
          role: 'zoomin',
     },
     {
          role: 'zoomout',
     },
     {
          role: 'resetzoom',
     },
     {
          type: 'separator',
     },
     {
          label: 'Go To',
          click: () => {
               win.webContents.send('goto', null)
          }
     },
     {
          label: 'Find',
          click: () => {
               win.webContents.send('find', null);
          }
     },
     {
          label: 'Replace',
          click: () => {
               win.webContents.send('replace', null);
          }
     },
     {
          type: 'separator',
     },
     {
          label: 'Select All',
          click: () => {
               win.webContents.send('sel-all', null);
          },
     },
     {
          label: 'Search Online',
          click: () => {
               win.webContents.send('search_gog', null);
          }
     }
]



const menu = Menu.buildFromTemplate(menu_templete);
Menu.setApplicationMenu(menu);

const context_menu = Menu.buildFromTemplate(context_menu_temp);


function shortcuts() {
     
     globalShortcut.register("CommandOrControl + P", () => {
          win.webContents.print();
     });
     globalShortcut.register("CommandOrControl + Shift + P", () => {
          win.webContents.print();
     });
     globalShortcut.register("CommandOrControl + E", () => {
          win.webContents.send("search_gog", null);
     });
     globalShortcut.register("CommandOrControl + F", () => {
          win.webContents.send("find", null);
     });
     globalShortcut.register("CommandOrControl + R", () => {
          win.webContents.send("replace", null);
     });
     globalShortcut.register("CommandOrControl + G", () => {
          win.webContents.send("goto", null);
     });
     globalShortcut.register("CommandOrControl + plus", () => {
          win.webContents.zoomFactor = win.webContents.getZoomFactor() + 0.20;
     });
     globalShortcut.register("CommandOrControl + -", () => {
          win.webContents.zoomFactor = win.webContents.getZoomFactor() - 0.20;
     });
     globalShortcut.register("CommandOrControl + I", () => {
          win.webContents.zoomFactor = 1.0;
     });
}