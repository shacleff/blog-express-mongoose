var express = require("express");
var router = express.Router();

router.get("/admin", function (req, res, next) {

    console.log("\nadmin req.userInfo =", req.userInfo);

    res.send("admin");
});

module.exports = router;