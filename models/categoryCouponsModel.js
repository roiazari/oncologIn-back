const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
city:String,
category:String,
info:String,
img_url:String
})
exports.Category_couponsModel = mongoose.model("category_couponss",schema)

exports.validateCatedoryCoupons = (_reqBody) => {
let joiSchema = Joi.object({
city:Joi.string().min(2).max(20).required(),
category:Joi.string().min(2).max(20).required(),
info:Joi.string().min(2).max(50).required(),
img_url:Joi.string().min(2).max(200).required(),
})
return joiSchema.validate(_reqBody)
}