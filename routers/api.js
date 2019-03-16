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
 *   1.用户名不能为空
 *   2.密码不能为空
 *   3.2次输入密码必须一致
 *   4.
 *
 */
router.post("/user/register", function (req, res, next) {
    console.log("req.body =", req.body);
    res.send("register");
});

router.post("/user/login", function (req, res, next) {
    res.send("login");
});

module.exports = router;