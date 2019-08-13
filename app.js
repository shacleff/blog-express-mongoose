var express = require("express"); // 加载express模块
var swig = require("swig"); // 加载模板处理模块
var app = express(); // 创建app应用 => node.js http.createServer();
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 解析post请求
var Cookies = require("cookies"); // 加载Cookies模块,密码记忆在cookie中

var User = require("./models/User"); // mongodb中User表

/**
 * 设置静态文件托管
 *    (1)当用户访问的url以/public开始，那么直接返回对应__dirname + "/public"下的文件
 */
app.use("/public", express.static(__dirname + "/public"));

/**
 * 配置应用模板,后缀
 *   (1)定义当前应用所使用的模板引擎
 *   (2)第一个参数:模板引擎的名称，同时也是模板文件的后缀
 *   (3)第二个参数表示用于解析处理模板内容的方法
 */
app.engine("html", swig.renderFile);

/**
 * 设置模板文件存放的目录
 *   (1)第一个参数必须是views
 *   (2)第二个参数是目录
 */
app.set("views", "./views");

/**
 * 注册所使用的模板引擎
 *   (1)第一个参数必须是view engine
 *   (2)第二个参数和app.engine这个方法中定义的模板引擎app.engine的名称中第一个参数是一致的
 */
app.set("view engine", "html");

/**
 * 开发过程中需要取消模板缓存
 *   (1)更改模板后，保存模板刷新页面即可，不需要重启服务器
 */
swig.setDefaults({cache: false});

/**
 * bodyParser中间件
 *   (1)为req对象上增加一个body属性
 *   (2)body-parser为解析一泡尿股提交的post请求
 *   (3)req.body = { username: '1072772483@qq.com', password: '1', repassword: '1' }
 */
app.use(bodyParser.urlencoded({extended: true}));

/**
 * 设置cookie
 *   (1)可见中间件都是给req之类的增加一些属性
 */
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);

    /**
     * 可以被所有路由访问的全局数据
     *   (1)解析登陆用户的登陆信息
     */
    req.userInfo = {};

    var userInfoJson = req.cookies.get("userInfo");

    /**
     * 由于cookies这个中间件，不论客户端请求哪个页面，都会把这个cookies发过来
     * console.log("\ncookies req.cookies.get(\"userInfo\") =", req.cookies.get("userInfo"));
     */
    if(userInfoJson){
        try{
            req.userInfo = JSON.parse(userInfoJson);

            /**
             * 获取User信息,之所以根据__id查找，是因为存储时存的就是__id
             *   (1)req.cookies.set("userInfo", JSON.stringify({ _id: userInfo._id, username: userInfo.username }));
             */
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);  // 不写数据库，而是动态从数据库获取
                next();
            });

        }catch (e) {
            console.log("err =", e.message);
        }
    }else {
        next();
    }
});

/**
 * 3个路由
 */
app.use("/admin", require("./routers/admin")); // admin管理
app.use("/api", require("./routers/api")); //客户端api
app.use("/", require("./routers/main"));


/**
 * 连接mongodb服务器
 *   (1)mongodb的数据库不用事先建立,即可直接访问
 */
mongoose.connect("mongodb://localhost:27018/blog2", function (err) {
    if(err){
        console.log("数据库连接失败");
    }else {
        console.log("数据库连接成功");
        app.listen(8081); // 连接数据库成功才监听http请求
        console.log("浏览器打开 http://localhost:8081");
    }
});

