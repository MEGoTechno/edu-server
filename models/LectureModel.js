const mongoose = require("mongoose")
const gradeConstants = require("../tools/constants/gradeConstants")
const UnitModel = require("./UnitModel")
const CourseModel = require("./CourseModel")
const VideoModel = require("./VideoModel")


const lectureSchema = new mongoose.Schema({
    grade: { type: Number, enum: gradeConstants.map(grade => grade.index), required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: UnitModel, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: CourseModel, required: true },

    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },

    video: {
        type: mongoose.Schema.Types.ObjectId, ref: VideoModel, required: true, select: false
    },
    thumbnail: {
        original_filename: { type: String },
        url: { type: String },
        size: { type: Number },
        resource_type: { type: String },
        format: { type: String }
    }
}, {
    timestamps: true,
    versionKey: false
})

const LectureModel = mongoose.model("lecture", lectureSchema)
module.exports = LectureModel