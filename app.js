const express = require("express");
const app = express();
const mysql = require("mysql")
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  //此处是你添加的数据库名
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
app.get('/login', function (req, res) {
  //获取用户输入的账号，密码
  var response = {
    "account": req.query.account,
    "password": req.query.password,
  };

  //创建查询数据的sql语句实现登录功能，查询账号和密码并且与用户输入的账号密码完全一致
  var selectSQL = "select account,password from user where account = '" + req.query.account + "' and password = '" + req.query.password + "'";
  //进行数据库操作
  connection.query(selectSQL, function (err, result) {
    //打印错误信息
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    //如果查询结果为空，则登录失败，否则登录成功
    if (result == '') {
      console.log("帐号密码错误");
      res.end("fail");
    }
    else {
      console.log("登录成功");
      res.end("success");
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
    "account": req.query.account,
    "password": req.query.password,
    "name": req.query.name
  };
  //创建增加数据的sql语句实现注册功能
  var addSql = 'INSERT INTO user(account,password,name) VALUES(?,?,?)';
  //获取用户输入的数据
  var addSqlParams = [req.query.account, req.query.password, req.query.name];
  connection.query(addSql, addSqlParams, function (err, result) {
    //如果插入数据失败，则注册失败，否则注册成功
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      res.end("fail");
      //如果失败就直接return不会执行下面的代码
      return;
    }
    res.end("success");
    console.log("注册成功");
  });
  console.log(response);
})