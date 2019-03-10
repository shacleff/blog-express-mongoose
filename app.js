// 加载express模块
var express = require("express");

// 创建app应用 => node.js http.createServer();
var app = express();

/**
 * 首页
 *   1.req request对象
 *   2.res response对象
 *   3.next 函数
 */
app.get("/", function (req, res, next) {
    res.send("<h1>欢迎光临我的blog!!!</h1>");
});

// 监听http请求
app.listen(8081);