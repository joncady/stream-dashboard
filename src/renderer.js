const electron = window.require('electron');

exports.settings = electron.remote.require("electron-settings");
exports.BrowserWindow = electron.remote.BrowserWindow;
exports.dialog = electron.remote.dialog;
exports.remote = electron.remote;
exports.fs = electron.remote.require('fs-extra');