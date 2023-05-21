const express= require("express");
const router = express.Router();
const bcrypt=require("bcrypt");
const {authToken, authAdmin} =require("../auth/authToken");
const {UsersModel,validateUsers, validateLogin, genToken} =require("../models/usersModel");
const { AdvisorsModel } = require("../models/advisorsModel");
const { CouponsModel } = require("../models/couponsModel");


router.get("/", async(req,res) => {
  let data= await UsersModel.find({});
  res.json(data);


});

router.get("/private", authToken, async(req,res) => {
  try{
    let data = await UsersModel.find({_id:req.tokenData._id});
    console.log(req.tokenData._id);
    res.json(data);
  
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", async(req,res) => {
  try{
    let data = await UsersModel.findOne({_id:req.params.id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/userInfo",authToken,async(req,res)=>{
  let user= await UsersModel.find({_id:req.tokenData._id},{password:0});
    res.json(user);
});

router.post("/", async(req,res)=>{
  let validBody= validateUsers(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
  let users = new UsersModel(req.body);
  users.password=await bcrypt.hash(users.password,10);
  await users.save();
  users.password="*****";
  res.status(201).json(users);
  }
  catch(err){
    console.log(err);
    res.status(400).json({err:"Email already in system or there another problem"})
  }
});



router.delete("/:idDel" ,authToken, async(req,res)=>{
  try{

    let _idDel=req.params.idDel;
    let data;
    if(req.tokenData.role=="business"){
     let delCoupon= await CouponsModel.deleteMany({added_by:_idDel}); 
    }
     if(req.tokenData.role=="advisor"){
    let delAdvice= await AdvisorsModel.deleteMany({added_by:_idDel}); 
  }
    
    data =await UsersModel.deleteOne({_id:_idDel});
     
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});
router.put("/:idEdit" , authAdmin, async(req,res)=>{
  let validBody= validateUsers(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  };
  try{
    let _idEdit=req.params.idEdit;
    let data;
    if(req.tokenData.role=="admin"){
      data =await UsersModel.updateOne({_id:_idEdit, user_id:req.tokenData.user_id},req.body); 
    }
    else{
      data =await UsersModel.updateOne({_id:_idEdit},req.body);
    }
   
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});

router.post("/login", async(req,res) => {
  let valdiateBody = validateLogin(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    // לבדוק אם המייל שנשלח בכלל יש רשומה של משתמש שלו
    let user = await UsersModel.findOne({email:req.body.email})
   

    if(!user){
      // שגיאת אבטחה שנשלחה מצד לקוח
      return res.status(200).json({msg:"User or password not valid"})
    }
    // בדיקה הסימא אם מה שנמצא בבאדי מתאים לסיסמא המוצפנת במסד
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(validPassword)
    console.log(req.body.password, user.password)
    if(!validPassword){
     
     
      return res.status(200).json({msg:"User or password not valid"})
    
    }
    // בשיעור הבא נדאג לשלוח טוקן למשתמש שיעזור לזהות אותו 
    // לאחר מכן לראוטרים מסויימים
    let token = genToken(user._id,user.role);
    res.json({token:token,role:user.role});
    
  }
  catch(err){
    
    console.log(err);
    res.status(500).json({msg:"err",err});
  }
})
router.get("/checkToken", authToken,async(req,res) => {
  try{
    res.json(req.tokenData);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



module.exports = router;