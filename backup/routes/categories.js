const express= require("express");
const {validateCategory,CategoryModel} = require("../models/categoryModel")
const router = express.Router();

router.get("/", async(req,res) => {
  try{
    let data = await CategoryModel.find({});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// TODO: need to add auth of admin
router.post("/" , async(req,res) => {
  let validBody = validateCategory(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let cateogry = new CategoryModel(req.body);
    await cateogry.save();
    res.status(201).json(cateogry);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/:id", async(req,res) => {
  let validBody = validateCategory(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let id = req.params.id;
    let data = await CategoryModel.updateOne({_id:id},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/:id", async(req,res) => {
  try{
    let id = req.params.id;
    let data = await CategoryModel.deleteOne({_id:id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;