const mongoose = require("mongoose");
const Joi = require("joi");

let advisorSchema = new mongoose.Schema({

name:String,
img_url:String,
info:String,
dateCreated:{
type:Date , default:Date.now
},
exprinced_year:Number,
location:String,
disease_ids :Array,
phone:String,
added_by:String,
})
exports.AdvisorsModel = mongoose.model("advisors",advisorSchema)

exports.validateAdvisors = (_reqBody) => {
let joiSchema = Joi.object({
name:Joi.string().min(2).max(20).required(),
img_url:Joi.string().min(1).max(350).allow(null,""),
info:Joi.string().min(2).max(2500).required(),
exprinced_year:Joi.number().min(0).max(20).required(),
location:Joi.string().min(2).max(20).required(),
phone:Joi.string().min(2).max(20).required(),
})
return joiSchema.validate(_reqBody)
}