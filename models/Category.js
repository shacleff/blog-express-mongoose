var mongoose = require("mongoose");

var schema = new mongoose.Schema({

    // 分类名称
    name: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Category", schema);