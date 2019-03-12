// 通过id找到登陆按钮
var $loginBox = $("#loginBox");

// 注册按钮
var $registerBox = $("#registerBox");

/**
 * 个人信息
 *   1.是管理员,有链接，点击进入管理
 *   2.不是管理员
 */
var $userInfo = $("#userInfo");

/**
 * 点击马上注册 切换登陆面板
 */
$registerBox.find("a.colMint").on("click", function () {
    $loginBox.show();
    $registerBox.hide();
});

/**
 * 1.先在html表单中获取
 * 2.ajax调用express服务器提供的 /api/user/register接口 用户注册
 */
$registerBox.find("button").on("click", function () {
    $.ajax({
        type: "post",
        url: "/api/user/register",  // express提供的 注册用户 路由
        data:{
            username: $registerBox.find('[name="username"]').val(),
            password: $registerBox.find('[name="password"]').val(),
            repassword: $registerBox.find('[name="repassword"]').val(),
        },
        dataType: "json",
        success: function (result) {
            $registerBox.find(".colWarning").html(result.message);

            if(!result.code){
                setTimeout(function () {
                    $loginBox.show();
                    $registerBox.hide();
                }, 1000);
            }
        }
    });
});

/**
 * 登陆功能
 */
$loginBox.find("button").on("click", function () {
    $.ajax({
        type: "post",
        url: "/api/user/login",
        data: {
            username: $loginBox.find('[name="username"]').val(),
            password: $loginBox.find('[name="password"]').val()
        },
        dataType: "json",
        success: function (result) {
            $loginBox.find(".colWarning").html(result.message);

            if(!result.code){
                window.location.reload();  // 界面重新加载
            }
        }
    });
});

/**
 * 退出
 */
$('#logout').on("click", function () {
    $.ajax({
        url: "/api/user/logout",
        success: function (result) {
            if(!result.code){
                window.location.reload();
            }
        }
    });
});







