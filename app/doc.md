将用户属性文件 进行打包
asar pack config.properties config.asar

备注：如果还没安装asar，请用下面的指令进行安装
npm install -g asar

本地简单存储 lowdb数据库的安装
npm install lowdb --save

--------------------------------------------------------------------------------------
使用lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

Check if posts exists.

db.has('posts')
  .value()
Set posts.

db.set('posts', [])
  .write()
Sort the top five posts.

db.get('posts')
  .filter({published: true})
  .sortBy('views')
  .take(5)
  .value()
Get post titles.

db.get('posts')
  .map('title')
  .value()
Get the number of posts.

db.get('posts')
  .size()
  .value()
Get the title of first post using a path.

db.get('posts[0].title')
  .value()
Update a post.

db.get('posts')
  .find({ title: 'low!' })
  .assign({ title: 'hi!'})
  .write()
Remove posts.

db.get('posts')
  .remove({ title: 'low!' })
  .write()
Remove a property.

db.unset('user.name')
  .write()
Make a deep clone of posts.

db.get('posts')
  .cloneDeep()
  .value()


--------------------------------------------------------------------------------------