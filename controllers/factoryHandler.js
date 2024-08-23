const asyncHandler = require("express-async-handler");
const { makeMatch } = require("../tools/makeMatch");
const statusTexts = require("../tools/statusTexts")
// const params = [
//     { key: "role", value: query.role },
//     { key: "name", value: query.name },
//     { key: "userName", value: query.userName },
//     { key: "email", value: query.email },
//     { key: "phone", value: query.phone },
//     { key: "familyPhone", value: query.familyPhone },
//     { key: "isActive", value: query.isActive, type: "boolean" },
//     { key: "grade", value: query.grade, operator: "equal" },
//     { key: "group", value: query.group, operator: "equal" },
// ]
exports.getAll = (Model, docName, params = [], populate = '') =>
    asyncHandler(async (req, res) => {

        const query = req.query

        //pagination
        const limit = query.limit || 10000
        const page = query.page || 1
        const skip = (page - 1) * limit

        // search && filter
        const match = {}
        if (params.length > 0) {
            makeMatch(match, params(query))
        }

        //sort 
        const sort = {}
        query.sortkey ? sort[query.sortkey] = query.sortvalue : null

        //select
        const select = query.select ? query.select : ""

        // //populate
        // const populate = req.populate || ""

        const docs = await Model.find(match).select(select).populate(populate).limit(limit).skip(skip).sort(sort)
        const count = await Model.countDocuments(match)

        let values = {}
        values[`${docName}`] = docs
        values.count = count

        res.status(200).json({ status: statusTexts.SUCCESS, values })

    });


exports.getOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const query = req.query

        //populate
        const populate = req.query?.populate || ""

        //select
        const select = query.select ? query.select : ""

        const doc = await Model.findById(id).populate(populate).select(select);
        if (!doc) {
            return next('error');
        }

        res.status(200).json({ status: statusTexts.SUCCESS, values: doc })

    });

exports.insertOne = (Model, withIndex = false) =>
    asyncHandler(async (req, res) => {

        if (withIndex) {
            const lastDoc = await Model.findOne().sort({ createdAt: -1 })
            const index = lastDoc?.index + 1 || 1
            req.body.index = index
            const doc = await Model.create(req.body);
            res.status(201).json({ status: statusTexts.SUCCESS, values: doc, message: 'doc has been created successfully' })
        }
        const doc = await Model.create(req.body);
        res.status(201).json({ status: statusTexts.SUCCESS, values: doc, message: 'doc has been created successfully' })
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!doc) {
            return next('error');
        }
        await doc.save();
        res.status(200).json({ status: statusTexts.SUCCESS, values: doc, message: 'doc has been updated successfully' })
    });

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next('no docs');
        }

        // Trigger "remove" event when update document
        await document.remove();
        res.status(200).json({ status: statusTexts.SUCCESS, message: 'doc has been deleted successfully' })
    });

exports.getDocCount = (Model, params = []) =>
    asyncHandler(async (req, res) => {

        const query = req.query

        // search && filter
        const match = {}
        makeMatch(match, params(query))

        const count = await Model.countDocuments(match)
        res.status(200).json({ status: statusTexts.SUCCESS, values: { count } })
    });