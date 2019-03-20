var express = require("express");
var router = express.Router();
var User = require("./../models/User");
var Content = require("./../models/Content");

/**
 * /user 前面这个横线不能少
 *
 * http://localhost:8081/api/user/
 *
 * 注意和ajax的post和get请求的对应，ajax是post，这里是get将得不到请求
 *
 * 用户注册逻辑
 *
 *   1.基本验证
 *     1.用户名不能为空
 *     2.密码不能为空
 *     3.2次输入密码必须一致
 *
 *   2.数据库查询
 *     1.用户是否已经被注册了
 *
 */
var responseData = {};

// 中间件，将返回代码格式统一起来
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };

    next();
});

router.post("/user/register", function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == ""){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ""){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(password !== repassword){
        responseData.code = 3;
        responseData.message = '两次输入密码必须一致';
        res.json(responseData);
        return;
    }

    //
    User.findOne({username: username}).then(function (userInfo) {
        console.log("\nuserInfo =", userInfo);
        if(userInfo){
            responseData.code = 4;
            responseData.message = "用户名已经被注册";
            res.json(responseData);
            return;
        }

        /**
         * 这里字段拼写错误，则会导致存不上这个字段
         */
        var user = new User({
            username: username,
            password: password
        });

        /**
         * 1.这个user.save 返回的又是一个Promise对象，因此接下来可以继续then
         * 2.像操作对象一样操作数据库
         */
        return user.save();

    }).then(function (newUserInfo) {

        console.log("\nnewUserInfo =", newUserInfo);
        responseData.message = "注册成功";
        res.json(responseData);
    });
});

router.post("/user/login", function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    if(!username || !password){
        responseData.code = 1;
        responseData.message = "用户名或密码不能为空";
        res.json(responseData);
        return;
    }

    // 查询数据库中相同用户名和密码的记录是否存在，如果存在则登陆成功
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }

        responseData.message = "登陆成功";

        responseData.userInfo = {
            _id : userInfo._id,
            username: userInfo.username
        };

        /**
         * 存储登陆信息到cookies中
         */
        req.cookies.set("userInfo", JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));

        res.json(responseData);
        return;
    });
});

/**
 * 退出登陆后清空cookie，其实cocos  creator也一样，本地数据localStorage就相当于这里的cookie
 */
router.post("/user/logout", function (req, res, next) {
    req.cookies.set("userInfo", null);
    res.json(responseData);
    next();
});

/**
 * 获得文章所有评论
 */
router.get("/comment", function (req, res) {
    var contentId = req.query.contentid || "";
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    });
});


/**
 * 评论提交
 */
router.post("/comment/post", function (req, res, next) {
    // 评论的id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content,
    };

    // 查询当前这篇文章的信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = "评论成功";
        responseData.data = newContent;
        res.json(responseData);
    });
});

module.exports = router;




















