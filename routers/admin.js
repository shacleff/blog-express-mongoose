var express = require("express");
var router = express.Router();
var User = require("./../models/User");

router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){
        res.send("只有管理员才能进入后台");
        return;
    }

    next();
});

/**
 * 首页
 * app.use("/admin", require("./routers/admin")); 这种其实指定的是以admin开头的路由访问的是/，再次写/admin就不对了
 *
 */
router.get("/", function (req, res, next) {

    console.log("\nadmin req.userInfo =", req.userInfo);

    res.render("admin/index", {
        userInfo: req.userInfo
    });
});

/**
 * 用户管理
 */
router.get("/user", function (req, res, next) {

    // 查询所有用户
    User.find().then(function (users) {

        res.render("admin/user_index", {
            userInfo: req.userInfo,
            users: users
        });
    });
});

module.exports = router;