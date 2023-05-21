const express= require("express");
const router = express.Router();
const {CouponsModel ,validateCoupons} =require("../models/couponsModel");
const {authToken} =require("../auth/authToken");

router.get("/", async(req,res) => {
  const searchQ = req.query.s;
  const{s,skip,take}=req.query; 
  try {
    let filterFind = {}
    if(searchQ){
      const searchExp = new RegExp(searchQ,"i")
      filterFind = {$or:[{title:searchExp},{info:searchExp}]}
    }
    let data= await CouponsModel.find(filterFind).limit(take).skip((skip-1)*take);
    const count = await CouponsModel.countDocuments();
  res.json({data,count});
  console.log(s,skip,take);
  } catch (error) {
    console.log(error)
    res.status(502).json({err})
  }
  
});

router.get("/private", authToken, async(req,res) => {
  
  try{
      console.log(req.tokenData);
    let data = await CouponsModel.find({added_by:req.tokenData._id});
    // let data = await CouponsModel.find();
    res.json(data);
    console.log({data});

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.post("/",authToken,async(req,res)=>{
  let validBody= validateCoupons(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
  let coupons = new CouponsModel(req.body);
  coupons.user_id=req.tokenData.user_id;
  coupons.added_by=req.tokenData._id;
  await coupons.save();
  res.status(201).json(coupons);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);

  }
});

router.delete("/:idDel" , authToken, async(req,res)=>{
  try{
    let _idDel=req.params.idDel;
    let data;
    if(req.tokenData.role=="admin"){
          data =await CouponsModel.deleteOne({_id:_idDel});
    }
    else{
      data =await CouponsModel.deleteOne({_id:_idDel ,user_id:req.tokenData.user_id});
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});
router.put("/:idEdit" , async(req,res)=>{
  let validBody= validateCoupons(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  };
  try{
    let _idEdit=req.params.idEdit;
    let data;
    if(req.tokenData.role=="admin"){
      data =await CouponsModel.updateOne({_id:_idEdit, user_id:req.tokenData.user_id},req.body); 
    }
    else{
      data =await CouponsModel.updateOne({_id:_idEdit},req.body);
    }
   
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});

// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", async(req,res) => {
  try{
    let data = await CouponsModel.findOne({_id:req.params.id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.post("/single/:id", async(req,res) => {
  try{
    const data= await CouponsModel.updateOne({_id:req.params.id},req.body,{upsert:true});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})






module.exports = router;