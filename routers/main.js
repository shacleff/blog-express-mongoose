var express = require("express");
var router = express.Router();
var Category = require("./../models/Category");
var Content = require("./../models/Content");

var data;

/**
 * 通用数据处理
 */
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: [],
    };

    Category.find().sort({_id: -1}).then(function (categories) {
        data.categories = categories;
        next();
    });
});

/**
 * 访问举例:
 *    (1)http://localhost:8081/?category=5d522c1da963740e972c7f6d
 *    (2)这个category字段, 是在进入首页时在layout.html中就设置好的,客户端点击后,自动跳转
 */
router.get("/", function (req, res, next) {

    data.category = req.query.category || "";
    data.count = 0;
    data.page = parseInt(req.query.page || 1);
    data.limit =2;
    data.pages= 0;

    var where = {};
    if(data.category){
        where.category = data.category;
    }

    // 跳转到首页后,在render时，给各个分类添加好跳转连接
    Content.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(["category", "user"]).sort({
            addTime: -1
        });
    }).then(function (contents) {
        data.contents = contents;
        res.render("main/index", data);
    });
});

router.get("/view", function (req, res) {
    var contentid = req.query.contentid || "";
    Content.findOne({
        _id: contentid
    }).then(function (content) {
        data.content = content;

        content.views++;
        content.save();  // 阅读数增加

        res.render("main/view", data);
    });
});

module.exports = router;