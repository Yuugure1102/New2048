const express = require('express')
// 引入封装的sql语句操作模块
const db = require('./db')
// 调用express.Rotuer()方法创建路由对象
const login = express.Router();
//固定写法：解析post参数的。 写在路由的前面
login.use(express.urlencoded({ extended: false }));
// 在路由对象上挂载具体的路由。


// 登陆
login.post('/login', (req, res) => {
  let { username, pwd } = req.body;
  // 调用封装的查询语句比对数据是否相同，如果数据相同回调的data就会返回一个非空数组
  db.query(`select * from user where name = '${username}' and pwd = '${pwd}' `, (data) => {
    if (data.length > 0) {
      res.send('登录成功')
    } else {
      res.send('登录失败')
    }
  })
})
// 注册
login.post('/register', (req, res) => {
  // 解构赋值
  let { username:name, pwd:pwd } = req.body;
  db.insert('user', { name,pwd }, (data) => {
    if (data.affectedRows > 0) {
      res.send("注册成功！")
    } else {
      res.send("注册失败！")
    }
  })
})
// 使用module.exprots导出路由对象
module.exports = login;