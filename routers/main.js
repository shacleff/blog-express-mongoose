var express = require("express");
var router = express.Router();
var Category = require("./../models/Category");

router.get("/", function (req, res, next) {

    /**
     * 读取数据库中的分类放前端展示
     *   1.根据id排序
     *      1 升序
     *     -1 降序
     */
    Category.find().sort({_id: -1}).then(function (categories) {

        console.log(categories);

        /**
         * 通过app.js中取得的cookies中的全局登陆状态数据，则把这个数据交给模板来处理,因此之前登陆过一次后，之后就直接登陆了              c
         */
        res.render("main/index", {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});

module.exports = router;