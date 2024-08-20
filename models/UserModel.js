const mongoose = require("mongoose")
const { user_roles } = require("../tools/constants/rolesConstants")
const gradeConstants = require("../tools/constants/gradeConstants")
const GroupModel = require("./GroupModel")

const governments = require("../tools/constants/governments")

const governDefault = 4

const userSchema = new mongoose.Schema({
    grade: { type: Number, enum: gradeConstants.map(grade => grade.index) },
    group: { type: mongoose.Schema.Types.ObjectId, ref: GroupModel }, // none => online
    name: { type: String },
    avatar: {
        original_filename: { type: String },
        url: { type: String },
        size: { type: Number },
        resource_type: { type: String },
        format: { type: String }
    },
    userName: { type: String, unique: true }, // as code | phone | userName
    email: { type: String, required: false },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    familyPhone: { type: String },
    isActive: { type: Boolean, default: true },
    role: {
        type: String, default: user_roles.ONLINE,
        enum: [user_roles.ADMIN, user_roles.SUBADMIN, user_roles.STUDENT, user_roles.ONLINE, user_roles.INREVIEW]
    },
    government: { type: Number, enum: governments.map(g => Number(g.id)), default: governDefault },
    devices: [{ type: String }],
    wallet: { type: Number, default: 0 }
    // totalPoints: { type: Number, default: 0 },  // only have group or ...
}, {
    timestamps: true,
    versionKey: false
})



const UserModel = mongoose.model("user", userSchema)
module.exports = UserModel