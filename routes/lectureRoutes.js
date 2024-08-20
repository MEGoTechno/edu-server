const { getLectures, getOneLecture, createLecture, deleteLecture, updateLecture } = require("../controllers/lectureController")
const upload = require("../middleware/storage")

const router = require("express").Router()

router.route("/")
    .get(getLectures)
    .post(upload.fields([{ name: "video" }, { name: "thumbnail" }]), createLecture)

router.route("/:id")
    .get(getOneLecture)
    .put(upload.fields([{ name: "video" }, { name: "thumbnail" }]), updateLecture)
    .delete(deleteLecture)

module.exports = router