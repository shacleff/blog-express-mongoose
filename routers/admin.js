var express = require("express");
var router = express.Router();
var User = require("./../models/User");
var Category = require("./../models/Category");

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

/**
 * 分类首页
 */
router.get("/category", function (req, res, next) {
    res.render("admin/category_index", {
        userInfo: req.userInfo,
    });
});


/**
 * 添加分类
 */
router.get("/category/add", function (req, res, next) {
    res.render("admin/category_add", {
        userInfo: req.userInfo,
    });
});

/**
 * 分类的保存
 *   1.get 返回界面
 *   2.post 接受表单提交过来的数据
 */
router.post("/category/add", function (req, res, next) {
    console.log("add req.body =", req.body);

    var name = req.body.name || '';
    if(!name){
        res.render("admin/error", {
            userInfo: req.userInfo,   // 由于继承来的页面的信息也需要初始化，因此需要传递这个userInfo
            message: "名称不能为空"
        });
        return;
    };

    // 数据库中是否已经存在了同分类的名称
    Category.findOne({
        name: name
    }).then(function (rs) {
        if(rs){
            res.render("admin/error", {
                userInfo: req.userInfo,   // 由于继承来的页面的信息也需要初始化，因此需要传递这个userInfo
                message: "分类已经存在"
            });

            return Promise.reject();  // 失败后保证不走下面的then
        }

        return new Category({
            name: name
        }).save();

    }).then(function (newCategory) {
        res.render("admin/success", {
            userInfo: req.userInfo,
            message: "分类保存成功",
            url: "/admin/category"
        });
    });



});

module.exports = router;