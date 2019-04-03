'use strict'
 
const electron = require('electron');
const client = require('electron-connect').client;

const {app,Menu,MenuItem  , BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const remote = require('electron').remote;
const ipc = electron.ipcMain;
 
let mainWindow = null;
 
//创建登录窗口
function createWindow() {
  mainWindow =new BrowserWindow({ width: 800, height: 600 })
  
	const URL = url.format({
		pathname: path.join(__dirname, 'app/index.html'),
		protocol: 'file',
		slashes: true
	});
 
	mainWindow.loadURL(URL);
 
    //打开开发者工具
	mainWindow.webContents.openDevTools();
 
	mainWindow.on('closed', () => {
		mainWindow = null;
		client.quit;
	});
	if(client){
		client.create(mainWindow);
	}	
}
 
let userEditorWindow = null;

ipc.on('sigShowRightClickMenu', (event) => {
	console.log('sssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
	//! 生成菜单
	const menu = new Menu();
	menu.append(new MenuItem({ label: 'Hello world' }));
	menu.append(new MenuItem({ type: 'separator' }));
	menu.append(new MenuItem({ label: 'Electron', click: () => {
				Electron.shell.openExternal('https://www.baidu.com');
			}
		})
	);
	const win = BrowserWindow.fromWebContents(event.sender);
	menu.popup(win);
});


//监听是否打开该窗口（用户编辑窗口）
ipc.on('open-user-editor', (event,message) => {
 
	if (mainWindow) {
		mainWindow.hide();
	}
 
	if (userEditorWindow) {
		return;
	}
	//创建用户编辑窗口
	userEditorWindow = new BrowserWindow({
		frame: false,
		height: 600,
		//resizable:false,
		width: 500,
		//maximizable:true,
	});
	const user_edit_url = url.format({
		pathname: path.join(__dirname, 'app/showUser.html'),
		protocol: 'file',
		slashes: true
	});
 
	userEditorWindow.loadURL(user_edit_url);
 
    //打开开发者工具
	userEditorWindow.webContents.openDevTools();
 
    //接收用户登录成功之后传过来的用户对象，并发送到用户编辑窗口
	if(message!=undefined){
		userEditorWindow.webContents.on('did-finish-load', function () {
			userEditorWindow.webContents.send('loginUserData', message);
		});
	}
 
	userEditorWindow.on('closed', () => {
		userEditorWindow = null;
	});
 
});
 
//接收窗口最小化通信
ipc.on('mini-user-editor-window', () => {
	userEditorWindow.minimize();
});
 
//接收窗口变小（还原到原状态）通信
ipc.on('turn-small-user-editor', () => {
	userEditorWindow.unmaximize();
});
 
//接收窗口最大化通信
ipc.on('turn-big-user-editor', () => {
	userEditorWindow.maximize();
});
 
//用户编辑窗口点击关闭时通信
ipc.on('close-user-editor-window', () => {
	if (userEditorWindow) {
		userEditorWindow.close();
	}
	if (mainWindow) {
		mainWindow.destroy();
		app.quit();
	}
 
});



app.on('ready', createWindow);
 
//所有窗口关闭时，退出程序
app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit();
	}
});
 
app.on('activate', () => {
	if (mainWindow == null) {
		createWindow();
	}
 
});