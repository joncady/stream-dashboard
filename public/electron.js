const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const express = require('express');
const httpApp = express();
const path = require('path');

httpApp.use(express.static(path.join(__dirname, 'webclient')));

const url = require('url');
// const ipc = electron.ipcMain;
let io;
let loadedData;
let bracket;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let server;

process.env.NODE_ENV = "production";

httpApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'webclient/dashboard.html'));
});

function createWindow() {

    server = httpApp.listen(3030);

    io = require('socket.io').listen(8889);

    io.on('connection', function (socket) {
        if (loadedData) {
            socket.emit('update', loadedData)
        };
        if (bracket) {
            socket.emit('updateBracket', bracket)
        }
        socket.on('update', function (data) {
            loadedData = data;
            io.emit('update', data);
        });
        socket.on('updateBracket', function (data) {
            bracket = data;
            io.emit('updateBracket', data);
        });
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000, height: 700, minWidth: 600, minHeight: 300, webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nativeWindowOpen: true 
        }
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        app.exit();
        server.close();
        io.close();
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
        server.close();
        io.close();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});