var express = require('express');
var router = express.Router();
var db = require("../config/db");
/**
 * 查询列表页
 */
router.get("/", function (req, res, next) {
  db.query("select * from user", function (err, rows) {
    if (err) {
      res.render("users", { title: "用户列表", datas: [] });
    } else {
      res.render("users", { title: "用户列表", datas: rows });
    }
  });
});
/**
 * 添加用户
 */
router.get("/add", function (req, res, next) {
  res.render("add");
});
router.post("/add", function (req, res, next) {
  var account = req.body.account;
  var password = req.body.password;
  var highestscore = req.body.highestscore;
  db.query("insert into user values('" + id + "','" + account + "','" + password + "','" + highestscore + "')", function (err, rows) {
    if (err) {
      res.send("新增失败" + err);
    } else {
      res.redirect("/users");
    }
  });
});
/**
 * 删除用户
 */
router.get("/del/:id", function (req, res) {
  var id = req.params.id;
  db.query("delete from user where id = " + id, function (err, rows) {
    if (err) {
      res.send("删除失败" + err);
    } else {
      res.redirect("/users");
    }
  });
});
/**
 * 修改
 */
router.get("/toUpdate/:id", function (req, res, next) {
  var id = req.params.id;
  var sql = "select * from user where id = " + id;
  console.log(sql);
  db.query(sql, function (err, rows) {
    if (err) {
      res.send("修改页面跳转失败");
    } else {
      res.render("update", { datas: rows });
    }
  });
});
router.post("/update", function (req, res, next) {
  var id = req.body.id;
  var account = req.body.account;
  var password = req.body.password;
  var sql = "update user set account = '" + account + "',password = '" + password + "' where id = '" + id ;
  console.log(sql);
  db.query(sql, function (err, rows) {
    if (err) {
      res.send("修改失败 " + err);
    } else {
      res.redirect("/users");
    }
  });
});
/**
 * 查询
 */
router.post("/search", function (req, res, next) {
  var account = req.body.account;
  var password = req.body.password;
  var id = req.body.id;
  var highestscore = req.body.highestscore;
  var sql = "select * from user";
  if (account) {
    sql += " where account = '" + account + "'";
  }
  if (password) {
    sql += " and password = '" + password + "'";
  }
  if (highestscore) {
    sql += " and highestscore = '" + highestscore + "'";
  }
  if (id) {
    sql += " and id = '" + id + "'";
  }
  sql.replace("and", "where");
  db.query(sql, function (err, rows) {
    if (err) {
      res.send("查询失败: " + err);
    } else {
      res.render("users", { title: "用户列表", datas: rows, id: id, account: account, password: password, highestscore: highestscore });
    }
  });
})
module.exports = router;