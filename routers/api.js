var express = require("express");
var router = express.Router();

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
})

router.post("/user/register", function (req, res, next) {

    var username = req.body.username;
    var passwrod = req.body.password;
    var repassword = req.body.repassword;

    if(username == ""){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(passwrod == ""){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(passwrod !== repassword){
        responseData.code = 3;
        responseData.message = '两次输入密码必须一致';
        res.json(responseData);
        return;
    }

    responseData.message = "注册成功";
    res.json(responseData);

});

router.post("/user/login", function (req, res, next) {
    res.send("login");
});

module.exports = router;