// 加载express模块
var express = require("express");

// 加载模板处理模块
var swig = require("swig");

// 创建app应用 => node.js http.createServer();
var app = express();

var mongoose = require("mongoose");

// 解析post请求
var bodyParser = require("body-parser");

// 加载Cookies模块
var Cookies = require("cookies");

/**
 * 设置静态文件托管
 *   1.当用户访问的url以/public开始，那么直接返回对应__dirname + "/public"下的文件
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
 * 1.为req对象上增加一个body属性
 * 2.body-parser为解析一泡尿股提交的post请求
 * 3.req.body = { username: '1072772483@qq.com', password: '1', repassword: '1' }
 */
app.use(bodyParser.urlencoded({extended: true}));


/**
 * 设置cookie
 *   1.可见中间件都是给req之类的增加一些属性
 */
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);

    /**
     * 可以被所有路由访问的全局数据
     *   1.解析登陆用户的登陆信息
     * @type {{}}
     */
    req.userInfo = {};

    var userInfoJson = req.cookies.get("userInfo");
    if(userInfoJson){
        try{
            req.userInfo = JSON.parse(userInfoJson);
        }catch (e) {

        }
    }

    // 由于cookies这个中间件，不论客户端请求哪个页面，都会把这个cookies发过来
    console.log("\ncookies req.cookies.get(\"userInfo\") =", req.cookies.get("userInfo"));

    next();
});

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

