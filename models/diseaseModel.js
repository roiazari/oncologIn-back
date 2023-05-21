const mongoose = require("mongoose");
const Joi = require("joi");

let diseaseSchema = new mongoose.Schema({
name:String,
info:String,
})
exports.DiseasesModel = mongoose.model("diseases",diseaseSchema)

exports.validateDiseases = (_reqBody) => {
let joiSchema = Joi.object({
name:Joi.string().min(2).max(50).required(),
info:Joi.string().min(2).max(1500).required(),
})
return joiSchema.validate(_reqBody)
}