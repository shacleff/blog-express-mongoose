var express = require("express");
var router = express.Router();
var Category = require("./../models/Category");
var Content = require("./../models/Content");

router.get("/", function (req, res, next) {

    var data = {
        page: parseInt(req.query.page || 1),
        limit: 2,
        pages: 0,
        categories: [],
        count: 0,
        userInfo: req.userInfo,
    };

    Category.find().sort({_id: -1}).then(function (categories) {
        data.categories = categories;
        return Content.count();
    }).then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;
        return Content.find().limit(data.limit).skip(skip).populate(["category", "user"]).sort({
            addTime: -1
        });
    }).then(function (contents) {
        data.contents = contents;
        res.render("main/index", data);
    });
});

module.exports = router;