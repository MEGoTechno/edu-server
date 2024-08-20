const multer = require("multer")


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname.replace(" ", "-")}`
        console.log(fileName)
        cb(null, fileName)
    }
})
const upload = multer({ storage })

module.exports = upload