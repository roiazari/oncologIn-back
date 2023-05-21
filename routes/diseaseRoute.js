const express= require("express");
const router = express.Router();
const {DiseasesModel ,validateDiseases} =require("../models/diseaseModel");

router.get("/", async(req,res) => {
  let data= await DiseasesModel.find({});
  res.json(data);
});

router.post("/", async(req,res)=>{
  let validBody= validateDiseases(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  let diseases = new DiseasesModel(req.body);
  await diseases.save();
  res.json(diseases);
});

router.delete("/:idDel" , async(req,res)=>{
  try{
    let data =await DiseasesModel.deleteOne({_id:req.params.idDel});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});
router.put("/:idEdit" , async(req,res)=>{
  let validBody= validateDiseases(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  };
  try{
    let data =await DiseasesModel.updateOne({_id:req.params.idEdit},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});



module.exports = router;