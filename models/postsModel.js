const mongoose = require("mongoose");
const Joi = require("joi");

let postsSchema = new mongoose.Schema({
user_id:String,
date_created:String,
title:String,
info:String,
disease_id:Number,
isAnonmys:Boolean,
user_name:String,
post_id:String
})
exports.PostsModel = mongoose.model("posts",postsSchema)

exports.validatePosts = (_reqBody) => {
let joiSchema = Joi.object({
title:Joi.string().min(2).max(50).required(),
info:Joi.string().min(2).max(1500).required(),
isAnonmys:Joi.number().min(1).max(20), //מה לבדוק כאן?זה בוליאני
disease_id:Joi.number().min(1).max(20),
user_name:Joi.number().min(2).max(50).required(),
post_id:Joi.number().min(1).max(1000),
});

return joiSchema.validate(_reqBody)
}