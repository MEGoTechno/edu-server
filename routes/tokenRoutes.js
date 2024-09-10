const { getTokens } = require("../controllers/tokenController")

const router = require("express").Router()

router.route("/")
    .get(getTokens)

module.exports = router