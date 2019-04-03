const { ipcRenderer } = require('electron')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)


window.onload=function(){
  
}

function showRightClickMenu() {
  //db.get('posts').push({ id: 1, title: 'lowdb is awesome'}).write()

  console.log(db.get('posts').find({ id: 1 }).value()['title'])
  ipcRenderer.send('sigShowRightClickMenu');
}