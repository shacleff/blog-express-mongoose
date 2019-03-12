// 加载express模块
var express = require("express");

// 加载模板处理模块
var swig = require("swig");

// 创建app应用 => node.js http.createServer();
var app = express();

var mongoose = require("mongoose");

/**
 * 设置静态文件托管
 *   1.当用户访问的url以/public开始，那么直接返回对应__dirname + "/public"下的文件
 *   2.
 */
app.use("/public", express.static(__dirname + "/public"));

/**
 * 配置应用模板
 *   1.定义当前应用所使用的模板引擎
 *   2.第一个参数:模板引擎的名称，同时也是模板文件的后缀
 *   3.第二个参数表示用于解析处理模板内容的方法
 */
app.engine("html", swig.renderFile);

/**
 * 设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
 */
app.set("views", "./views");

/**
 * 注册所使用的模板引擎
 *   1.第一个参数必须是view engine
 *   2.第二个参数和app.engine这个方法中定义的模板引擎的名称(第一个参数)是一致的
 */
app.set("view engine", "html");

/**
 * 开发过程中需要取消模板缓存
 *   1.更改模板后，保存模板刷新页面即可，不需要重启服务器
 */
swig.setDefaults({cache: false});

/**
 *
 */
app.use("/admin", require("./routers/admin"));
app.use("/api", require("./routers/api"));
app.use("/", require("./routers/main"));


/**
 * 首页
 *   1.req request对象
 *   2.res response对象
 *   3.next 函数
 */
// app.get("/", function (req, res, next) {
//     // res.send("<h1>欢迎光临我的blog!!!</h1>");
//
//     /**
//      * 读取views目录下的指定文件，解析并返回给客户端
//      *   1.第一个参数：表示模板的文件，相对于views目录， 读取并解析 views/index.html
//      *   2.第二个参数：传递给模板使用的数据
//      */
//     res.render("index");
// });

mongoose.connect("mongodb://localhost:27018/blog2", function (err) {
    if(err){

        console.log("\n数据库连接失败");

    }else {

        console.log("\n数据库连接成功");

        // 监听http请求
        app.listen(8081);
    }
});

