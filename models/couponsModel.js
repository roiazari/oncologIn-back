const mongoose = require("mongoose");
const Joi = require("joi");

let couponSchema = new mongoose.Schema({
title:String,
img_url:String,
info:String,
adress:String,
category_id:Number,
lat:Number,
lon: Number,
up_to_date:{
type:Date , default:Date.now
},
date_created:{
type:Date , default:Date.now
},
link_url:String,
added_by:String,

})
exports.CouponsModel = mongoose.model("couponss",couponSchema)

exports.validateCoupons = (_reqBody) => {
let joiSchema = Joi.object({
title:Joi.string().min(2).max(100).required(),
img_url:Joi.string().min(2).max(350).allow(null,""),
info:Joi.string().min(2).max(3000).required(),
adress:Joi.string().min(2).max(50).required(),
category_id:Joi.number().min(1).max(10).allow(null,""),
lat:Joi.number().min(1).max(10).allow(null,""),
lon:Joi.number().min(1).max(10).allow(null,""),
link_url:Joi.string().min(2).max(100).required(),
})
return joiSchema.validate(_reqBody);
}