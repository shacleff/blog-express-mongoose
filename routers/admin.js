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
 * 用户管理: 分页展示
 */
router.get("/user", function (req, res, next) {


    // 玩家请求第几页
    var page = parseInt(req.query.page || 1);

    // 一页限制10条记录
    var limit = 10;

    // 当前一共几页
    var pages = 0;

    // 统计有几条记录
    User.count().then(function (count) {
        pages = Math.ceil(count/limit);

        // 限制在合适的请求页数内
        page = Math.min(page, pages);

        // 最小1页
        page = Math.max(page, 1);

        // 当前请求页数跳过的数据条数
        var skip = (page - 1) * limit;

        /**
         * 1 升序
         * -1 降序
         */
        User.find().sort({_id: -1}).limit(limit).skip(skip).then(function (users) {
            res.render("admin/user_index", {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    });
});

/**
 * 分类首页: 分页展示
 */
router.get("/category", function (req, res, next) {

    // 玩家请求第几页
    var page = parseInt(req.query.page || 1);

    // 一页限制10条记录
    var limit = 10;

    // 当前一共几页
    var pages = 0;

    // 统计有几条记录
    Category.count().then(function (count) {
       pages = Math.ceil(count/limit);

       // 限制在合适的请求页数内
       page = Math.min(page, pages);

       // 最小1页
       page = Math.max(page, 1);

       // 当前请求页数跳过的数据条数
       var skip = (page - 1) * limit;

       Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
           res.render("admin/category_index", {
               userInfo: req.userInfo,
               categories: categories,
               count: count,
               pages: pages,
               limit: limit,
               page: page
           });
       });
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

/**
 * 分类修改
 */
router.get("/category/edit", function (req, res) {
    var id = req.query.id || "";

    Category.findOne({
        _id: id
    }).then(function (category) {
        if(!category){
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "分类信息不存在"
            });

            return Promise.reject();
        }

        res.render("admin/category_edit", {
            userInfo: req.userInfo,
            category: category
        });

    });
});

/**
 * 分类保存: 虽然和上面参数一样，但是这个是post，上面那个是get
 */
router.post("/category/edit", function (req, res, next) {

    // 当前修改的
    var id = req.query.id || '';

    var name = req.body.name || "";

    Category.findOne({
        _id: id
    }).then(function (category) {
        if(!category){
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "分类信息不存在"
            });
            return Promise.reject();  // 不再进入下面的then
        }

        // 名称没有修改
        if(name == category.name){
            res.render("admin/success", {
                userInfo: req.userInfo,
                message: "当前没做任何修改",
                url: "/admin/category"
            });

            return Promise.reject();
        }

        return Category.findOne({

            // 不等于当前id，名字还一样的
            _id: {$ne: id},
            name: name
        });

    }).then(function (sameCategory) {
        if(sameCategory){
            res.render("/admin/error", {
                userInfo: req.userInfo,
                message: "数据库中已经存在同名分类"
            });
            return Promise.reject();
        }

        /**
         * 尝试更新数据, 这个add search很简单   update 难一点   del呢？
         * 1.条件 2.要修改的值
         */
        return Category.update({
            _id: id
        }, {
            name: name
        });
    }).then(function () {
        res.render("admin/success", {
            userInfo: req.userInfo,
            message: "修改成功",
            url: "/admin/category"
        });
    });

});


/**
 * 分类删除
 *   1.<a href="/admin/category/delete?id={{category._id.toString()}}">删除</a>   通过跳转的连接，因此，可以得到query的id
 */
router.get("/category/delete", function (req, res, next) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render("admin/success", {
            userInfo: req.userInfo,
            message: "删除成功",
            url: '/admin/category'
        });
    });
});

/**
 * 内容添加页面
 */
router.get("/content/add", function (req, res) {
    Category.find().then(function (categories) {
        res.render("admin/content_add", {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});

module.exports = router;























