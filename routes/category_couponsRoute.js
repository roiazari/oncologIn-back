const express= require("express");
const router = express.Router();
const {Category_couponsModel , validateCatedoryCoupons} =require("../models/categoryCouponsModel");


router.get("/", async(req,res) => {
  let data= await Category_couponsModel.find({});
  res.json(data);
});

router.post("/", async(req,res)=>{
  let validBody= validateCatedoryCoupons(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  let category_coupons = new Category_couponsModel(req.body);
  await category_coupons.save();
  res.json(category_coupons);
});
router.delete("/:idDel" , async(req,res)=>{
  try{
    let data =await Category_couponsModel.deleteOne({_id:req.params.idDel});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});
router.put("/:idEdit" , async(req,res)=>{
  let validBody= validateCatedoryCoupons(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  };
  try{
    let data =await Category_couponsModel.updateOne({_id:req.params.idEdit},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});



module.exports = router;