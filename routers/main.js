var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {

    /**
     * 通过app.js中取得的cookies中的全局登陆状态数据，则把这个数据交给模板来处理,因此之前登陆过一次后，之后就直接登陆了              c
     */
    res.render("main/index", {
        userInfo: req.userInfo
    });

});

module.exports = router;