var router = require("express").Router()

const path = require("path")

// Static Views
router.use("/", require(path.join(__dirname, "main")))
router.use("/account", require(path.join(__dirname, "account")))
router.use("/my", require(path.join(__dirname, "personal")))

// Dynamic Views
router.use("/games", require(path.join(__dirname, "games")))
router.use("/data", require(path.join(__dirname, "data")))

module.exports = router