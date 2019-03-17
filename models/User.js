var mongoose = require("mongoose");

/**
 * 用户表结构
 *   1.required 这个为true表示插入前必须检查，没传入则不会执行成功. 但是没报错，有点蛋疼
 */
var usersSchema = new mongoose.Schema({

    // 用户名
    username: {
        type: String,
        required: true
    },

    // 密码
    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
});

/**
 * 1.导出可以操作的对象
 * 2.这个第一个参数将会是 mongodb中存储的表格的名字，而且不仅被变小写，而且被加了s，变为users
 * 3.好在导出后像操作对象一样对导出的这个对象操作来操作数据库,
 */
module.exports = mongoose.model("User", usersSchema);