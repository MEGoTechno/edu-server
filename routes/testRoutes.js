const expressAsyncHandler = require("express-async-handler")
const { addToVimeo } = require("../middleware/cloudinary")
const upload = require("../middleware/storage")

const router = require("express").Router()


router.post("/", upload.single('file'), expressAsyncHandler(async (req, res, next) => {
    const file = req.file

    const video = await addToVimeo(file)

    res.json(video)
}))

module.exports = router