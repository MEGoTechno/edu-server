const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const bodyParser = require("body-parser")
const helmet = require("helmet")
const morgan = require("morgan")
const app = express()
const { default: mongoose } = require("mongoose")

// get fc routes
const verifyToken = require("./middleware/verifyToken")
const createError = require("./tools/createError")

const { notFound, errorrHandler } = require("./middleware/errorsHandler")

const testRoutes = require("./routes/testRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const codeRoutes = require("./routes/codeRoutes")

const unitRoutes = require("./routes/unitRoutes")
const courseRoutes = require("./routes/courseRoutes")
const lecturesRoutes = require("./routes/lectureRoutes")

const userCourseRoutes = require("./routes/userCourseRoutes")
const statisticsRoutes = require("./routes/statisticsRoutes")

// config
dotenv.config()
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
process.env.NODE_ENV === 'development' && app.use(morgan('tiny'))

const port = process.env.PORT || 5001
const DB_URI = process.env.MONGO_URI


//routes config
app.use("/api/test", testRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/codes", codeRoutes)

app.use("/api/content/units", unitRoutes)
app.use("/api/content/courses", courseRoutes)
app.use("/api/content/lectures", lecturesRoutes)

app.use("/api/user_courses", userCourseRoutes)
app.use("/api/statistics", statisticsRoutes)

app.get("/test", (req, res, next) => res.json({ url: DB_URI }))
// for secure folders
app.use("/secure", verifyToken, (req, res, next) => {
    next()
})
app.use("/secure", express.static("secure"))

// for errors 
app.use(notFound)
app.use(errorrHandler)



app.listen(port, async () => {
    await mongoose.connect(DB_URI).then(() => {
        console.log('DB connected successfully')
    })

    console.log(`the app is working on port: ${port}`)
})
