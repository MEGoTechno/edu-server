const asyncHandler = require("express-async-handler")
const UserModel = require("../models/UserModel")

const bcrypt = require("bcryptjs")
const { generateToken } = require("../middleware/generateToken.js");

const statusTexts = require("../tools/statusTexts.js")

// @desc user login
// @route POST /login
// @access Public   
const login = asyncHandler(async (req, res, next) => {
    const { userName, password } = req.body

    const select = 'userName name password avatar email isAdmin phone familyPhone isActive role totalPoints wallet'
    const user = await UserModel.findOne({ userName }).populate("grade group").select(select)

    if (user) {
        const isTruePass = await bcrypt.compare(password, user.password)
        if (isTruePass) {
            const userDoc = user._doc
            const token = generateToken({ id: userDoc._id })
            delete userDoc.password

            if (userDoc.isActive) {
                res.status(200).json({ status: statusTexts.SUCCESS, values: { ...userDoc, token }, message: "logged in successfully" })
            } else {
                const error = createError("sorry, you are not active ", 401, statusTexts.FAILED)
                next(error)
            }
        } else {
            const error = createError("incorrect password ", 400, statusTexts.FAILED)
            next(error)
        }

    } else {
        const error = createError("user not found ", 404, statusTexts.FAILED)
        next(error)
    }
})

// @desc user signup
// @route POST /signup
// @access Public   
const signup = asyncHandler(async (req, res, next) => {
    const { grade, group, name, password, phone, avatar, email, familyPhone, government, code } = req.body

    const foundUser = await UserModel.findOne({ phone })

    if (foundUser) {
        const error = createError("invalid phone", 400, statusTexts.FAILED)
        next(error)
    } else {

        const foundCode = await Code.findOne({ code, usedBy: "null" })
        if (foundCode) {

            const hashedPassword = bcrypt.hashSync(password, 10)
            const createdDoc = await UserModel.create({
                grade, group, name, password: hashedPassword, phone, avatar, email, familyPhone, government
            })
            const user = createdDoc._doc
            // register user id in code model
            foundCode.usedBy = user._id
            await foundCode.save()

            const token = generateToken({ id: user._id })

            res.status(200).json({ status: statusTexts.SUCCESS, values: { ...user, token }, message: "user created successfully" })
        } else {
            const error = createError("invalid code", 400, statusTexts.FAILED)
            next(error)
        }
    }
})

module.exports = { login, signup }