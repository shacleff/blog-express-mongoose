var mongoose = require("mongoose");

var schema = new mongoose.Schema({

    /**
     * 关联字段-分类id
     */
    category: {

        // 类型
        type: mongoose.Schema.Types.ObjectId,

        // 引用: 引用另一张表?????
        ref: 'Category'
    },

    // 内容标
    title: {
        type: String,
        required: true
    },

    // 简介
    description: {
        type: String,
        default: ""
    },

    // 内容
    content: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Content", schema);