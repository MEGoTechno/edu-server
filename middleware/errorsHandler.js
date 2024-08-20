const createError = require("../tools/createError")
const statusTexts = require("../tools/statusTexts")

const notFound = ((req, res, next) => {
    const error = createError(`Not found page at ${req.originalUrl}`, 404)
    next(error)
})


const errorrHandler = ((err, req, res, next) => {
    const statusCode = err?.statusCode || err?.error?.statusCode || 500
    // console.log(err)
    const message = err.message || err.error?.message || "connection confused"

    if (err.generated) {
        delete err.generated
        res.status(statusCode).json({ ...err })
    } else {
        res.status(statusCode).json({ message, status: statusTexts.FAILED })
    }
})

module.exports = { notFound, errorrHandler }