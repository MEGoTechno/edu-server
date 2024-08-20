const asyncHandler = require("express-async-handler")

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

const UserModel = require("../models/UserModel");
const createError = require("../tools/createError");
const { FAILED } = require("../tools/statusTexts");

// config
dotenv.config()
const SECRETJWT = process.env.SECRETJWT


const verifyToken = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization !== 'undefined') {
        const { userId } = jwt.verify(req.headers.authorization.split(" ")[1], SECRETJWT)

        const user = await UserModel.findById(userId)
        if (user && user.isActive) {
            req.user = user
            next()

        } else {
            const inActiveError = createError("you are not active", 401, FAILED, true)
            return next(inActiveError)
        }
    } else {
        const notAuthed = createError("login first", 401, FAILED, true)
        return next(notAuthed)
    }
})

module.exports = verifyToken