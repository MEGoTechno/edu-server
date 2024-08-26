const mongoose = require("mongoose")
const UnitModel = require("./UnitModel")
const gradeConstants = require("../tools/constants/gradeConstants")


const courseSchema = new mongoose.Schema({
    grade: { type: Number, enum: gradeConstants.map(grade => grade.index), required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: UnitModel, required: true },
    index: { type: Number, required: true, unique: true },

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    preDiscount: { type: Number },
    isActive: { type: Boolean, required: true },

}, {
    timestamps: true,
    versionKey: false
})

const CourseModel = mongoose.model("course", courseSchema)
module.exports = CourseModel