const { getAllUsersCourses, subscribe, getUserCourses } = require("../controllers/userCourseController")
const verifyToken = require("../middleware/verifyToken")

const router = require("express").Router()

router.route("/")
    .get(verifyToken, getUserCourses)

router.route("/users")
    .get(getAllUsersCourses)

router.route("/subscribe")
    .post(verifyToken, subscribe)


module.exports = router
