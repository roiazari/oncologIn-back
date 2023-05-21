const mongoose = require("mongoose");
const Joi = require("joi");
const jwt =require("jsonwebtoken");
 const {config} = require("../config/secret");
let usersSchema = new mongoose.Schema({
user_id:String,
name:String,
email:String,
phone:String,
password:String,
role:{
    type: String,
    default:"user"
},
date_created:{
type:Date , default:Date.now
},
disease_id:Array,
hospital_id:Array,
})
exports.UsersModel = mongoose.model("users",usersSchema)

exports.validateUsers = (_reqBody) => {
let joiSchema = Joi.object({
user_id:Joi.string().min(2).max(100).required(),
name:Joi.string().min(2).max(50).required(),
email:Joi.string().min(10).max(50).email().required().email(),
phone:Joi.string().min(9).max(50).required(),
password:Joi.string().min(1).max(20).required() ,
role:Joi.string().min(2).max(20).allow("",null)
// disease_id:Joi.array().min(1).max(5).required(),
// hospital_id:Joi.array().min(1).max(50).required(),
})
return joiSchema.validate(_reqBody)
}

exports.genToken=(_userId,role)=>{
    let token= jwt.sign({_id:_userId,role},config.tokenSecret,{expiresIn:"60mins"});
    return token;

}

exports.userValid = (_bodyValid) =>{
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        // email() -> בודק שגם האימייל לפי תבנית מייל
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(1).max(20).required(),
    })
    return joiSchema.validate(_bodyValid);
  }



  exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
    email:Joi.string().min(10).max(50).email().required().email(),
    password:Joi.string().min(1).max(20).required()
    })
    return joiSchema.validate(_reqBody)
    };

   

    

    

