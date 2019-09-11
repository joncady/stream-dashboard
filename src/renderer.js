// connection between "front" and "back" end
// currently unused

const electron = window.require('electron');

const ipcRenderer  = electron.ipcRenderer;

exports.settings = electron.remote.require('electron-settings');


exports.ipcRenderer = ipcRenderer;