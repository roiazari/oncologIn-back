const express= require("express");
const router = express.Router();
const {AdvisorsModel ,validateAdvisors} =require("../models/advisorsModel");
const {authToken} =require("../auth/authToken");


router.get("/", async(req,res) => {
  const searchQ = req.query.s;
  const{s,skip,take}=req.query; 
  try {
    let filterFind = {}
    if(searchQ){
      const searchExp = new RegExp(searchQ,"i")
      filterFind = {$or:[{name:searchExp},{info:searchExp}]}
    }
    let data= await AdvisorsModel.find(filterFind).limit(take).skip((skip-1)*take);
    const count = await AdvisorsModel.countDocuments();
    res.json({data,count});
    console.log(s,skip,take);
  } catch (error) {
    console.log(error)
    res.status(502).json({err})
  }

});


router.get("/private", authToken, async(req,res) => {
  try{

    let data = await AdvisorsModel.find({added_by:req.tokenData._id});
    res.json(data);
    console.log(data);
    }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.post("/",authToken, async(req,res)=>{
  let validBody= validateAdvisors(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
  let advisors = new AdvisorsModel(req.body);
  advisors.user_id=req.tokenData.user_id;
  advisors.added_by=req.tokenData._id;
  await advisors.save();
  res.status(201).json(advisors);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);

  }

});

router.delete("/:idDel",authToken , async(req,res)=>{
  console.log("ddfdd");
  try{
   
    let _idDel=req.params.idDel;
    let data;
    if(req.tokenData.role=="admin"){
          data =await AdvisorsModel.deleteOne({_id:_idDel});
    }
    else{
      data =await AdvisorsModel.deleteOne({_id:_idDel ,user_id:req.tokenData.user_id});

    }
    console.log(data);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }

});

router.put("/:idEdit" , async(req,res)=>{
  let validBody= validateAdvisors(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  };
  try{
    let _idEdit=req.params.idEdit;
    let data;
    if(req.tokenData.role=="admin"){
      data =await AdvisorsModel.updateOne({_id:_idEdit, user_id:req.tokenData.user_id},req.body); 
    }
    else{
      data =await AdvisorsModel.updateOne({_id:_idEdit},req.body);
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
    let data = await AdvisorsModel.findOne({_id:req.params.id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
//ערכית עצה
router.post("/single/:id", async(req,res) => {
  try{
    const data= await AdvisorsModel.updateOne({_id:req.params.id},req.body,{upsert:true});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;


