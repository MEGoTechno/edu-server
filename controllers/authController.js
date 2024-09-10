const asyncHandler = require("express-async-handler")
const UserModel = require("../models/UserModel")

const bcrypt = require("bcryptjs")
const { generateToken } = require("../middleware/generateToken.js");

const statusTexts = require("../tools/statusTexts.js")
const createError = require("../tools/createError.js");
const CodeModel = require("../models/CodeModel.js");
const codeConstants = require("../tools/constants/codeConstants.js");
const { user_roles } = require("../tools/constants/rolesConstants.js");
const TokenModel = require("../models/TokenModel.js");

// @desc user login
// @route POST /login
// @access Public   
const login = asyncHandler(async (req, res, next) => {
    const { userName, password } = req.body

    const select = 'userName name password avatar email isAdmin phone familyPhone isActive role totalPoints wallet'
    const user = await UserModel.findOne({ userName }).populate("grade group").select(select)
    if (user?.role === user_roles?.INREVIEW) return next(createError("Your account in review, will be activated soon !", 401, statusTexts.FAILED))

    if (user) {
        const isTruePass = await bcrypt.compare(password, user.password)
        if (isTruePass) {
            const userDoc = user._doc
            delete userDoc.password

            if (userDoc.isActive) {
                const token = generateToken({ id: userDoc._id })
                await TokenModel.create({ user: userDoc._id, token })

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
    const { password, phone, code } = req.body

    const foundUser = await UserModel.findOne({ phone })

    if (foundUser) {
        const error = createError("هذا الرقم غير صالح !", 400, statusTexts.FAILED)
        next(error)
    } else {

        const foundCode = await CodeModel.findOne({ code, numbers: { $ne: 0 } })
        if (!foundCode && code) return next(createError("invalid code, If you don`t have code register without code !", 400, statusTexts.FAILED))

        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = new UserModel({
            ...req.body, password: hashedPassword, phone, role: user_roles.INREVIEW, userName: phone
        })

        if (foundCode && foundCode?.type !== codeConstants.CENTER && foundCode?.isActive) {
            // code =>activate || wallet

            // const user = await UserModel.findOne({ phone })

            foundCode.usedBy.push(user._id)
            foundCode.numbers = foundCode.numbers - 1
            user.role = user_roles.ONLINE

            if (foundCode.type === codeConstants.WALLET) {
                user.wallet = user.wallet + foundCode.price
            }

            // register user id in code model
            await user.save()
            await foundCode.save()

            const token = generateToken({ id: user._id })
            await TokenModel.create({ user: user._id, token })
            
            const sendUser = user._doc
            delete sendUser.password

            res.status(201).json({ status: statusTexts.SUCCESS, values: { ...sendUser, token }, message: "تم انشاء المستخدم بنجاح, رصيد محفظتك به " + user.wallet })
        } else { // no codes , put inreview role
            await user.save()
            res.status(201).json({ status: statusTexts.SUCCESS, message: "تم اضافه المستخدم بنجاح, سيتم التفعيل قريبا!" })
        }
    }
})

const logout = asyncHandler(async (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization !== 'undefined' && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization
        const session = await TokenModel.findOne({ token })

        if (session) {
            const nowDate = new Date()

            session.logout = nowDate
            await session.save()

            return res.status(204).json()
        } else {
            return next(createError('Something went wrong', 401, statusTexts.FAILED))
        }

    } else {
        return next(createError('Something went wrong', 401, statusTexts.FAILED))
    }
})
module.exports = { login, signup, logout }