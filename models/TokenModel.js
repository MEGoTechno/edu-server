const mongoose = require("mongoose")
const UserModel = require("./UserModel")


const tokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: UserModel, required: true },
    token: { type: String },
    logout: { type: Date }
}, {
    timestamps: true,
    versionKey: false
})

const TokenModel = mongoose.model("token", tokenSchema)
module.exports = TokenModel

// device