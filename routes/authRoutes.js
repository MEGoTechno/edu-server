const { login, signup, logout } = require("../controllers/authController")

const router = require("express").Router()


router.post("/login", login)
router.post('/signup', signup)
router.get('/logout', logout)

module.exports = router
