const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
window = dom.window;
document = window.document;
XMLHttpRequest = window.XMLHttpRequest;
const app = express();
var http = require('http'); 
var router = express.Router();
var fs = require('fs');
const mysql = require("mysql")
var bodyParser=require('body-parser')
const multer = require('multer');
app.use(bodyParser.json())

const storage = multer.diskStorage({
  destination(req, file, cb) {
      cb(null, 'file') // 设置文件保存的文件夹,存储的文件夹必须自己先创建，如果没有的话会报错，只需要文件名，不需要改路径
  },
  filename(req, file, cb) {
      cb(null, randomNumber(1,1000000) + '-' + file.originalname) // 设置保存的文件名
  }
});

// 随机数
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}



const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "my_sql",
  multipleStatements: true,
})
app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Content-Type", "application/json;charset=utf-8")
  next()
})
app.get('/login',function (req,res) {
  //获取用户输入的账号，密码
  var response = {
     "account":req.query.account,
     "password":req.query.password,
  };
 //创建查询数据的sql语句实现登录功能，查询账号和密码并且与用户输入的账号密码完全一致
  var selectSQL = "select account,password from user where account = '"+req.query.account+"' and password = '"+req.query.password+"'";
  //进行数据库操作
  connection.query(selectSQL,function (err, result) {
      //打印错误信息
      if(err){
       console.log('[login ERROR] - ',err.message);
       return;
      }
      //如果查询结果为空，则登录失败，否则登录成功
      if(result=='')
      {
          console.log("帐号密码错误");
          res.end("fail");
      }
      else
      {
          console.log("登录成功");
          res.redirect("/");
      }
  });
  console.log(response);
})
app.get('/register.html', function (req, res) {
  res.sendFile(__dirname + "/" + "register.html");
})
//创建实现注册功能的路由
app.get('/process_get', function (req, res) {
  //获取用户输入的账号，密码，姓名
  var response = {
      "account":req.query.account,
      "password":req.query.password,
  };
  //创建增加数据的sql语句实现注册功能
  var testsql="select account from user where account = '"+req.query.account+"'";
    var  addSql = 'INSERT INTO user(account,password) VALUES(?,?)';
    //获取用户输入的数据
    var  addSqlParams = [req.query.account,req.query.password];
    connection.query(addSql,addSqlParams,function (err, result) {
         //如果插入数据失败，则注册失败，否则注册成功
         if(err){
          console.log('[INSERT ERROR] - ',err.message);
          res.end("fail");
          //如果失败就直接return不会执行下面的代码
          return;
         }
         res.end("success");
         console.log("注册成功");
     });

  console.log(response);
})
app.get('/getUser', (req, res) => {
  connection.query('select * from user order by highestscore DESC', (err, data, field) => {
    if (!err) {
      //返回查询数据
      res.send(data)
    }
  })
})





module.exports = router;