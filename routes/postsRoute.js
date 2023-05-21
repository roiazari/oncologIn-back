const express= require("express");
const router = express.Router();
const {PostsModel ,validatePosts} =require("../models/postsModel");
const {authToken} =require("../auth/authToken");

router.get("/", async(req,res) => {
  let data= await PostsModel.find({});
  res.json(data);
});

// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", async(req,res) => {
  try{
    let data = await PostsModel.findOne({_id:req.params.id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.post("/", authToken, async(req,res)=>{
  let validBody= validatePosts(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
  let posts = new PostsModel(req.body);
  posts.user_id=req.tokenData._user_id;
  await posts.save();
  res.status(201).json(posts);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);

  }

});
router.delete("/:idDel" , async(req,res)=>{
  try{
    let _idDel=req.params.idDel;
    let data;
    if(req.tokenData.role=="admin"){
          data =await PostsModel.deleteOne({_id:_idDel});
    }
    else{
      data =await PostsModel.deleteOne({_id:_idDel ,user_id:req.tokenData.user_id});

    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});
router.put("/:idEdit" , async(req,res)=>{
  let validBody= validatePosts(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  };
  try{
    let _idEdit=req.params.idEdit;
    let data;
    if(req.tokenData.role=="admin"){
      data =await PostsModel.updateOne({_id:_idEdit, user_id:req.tokenData.user_id},req.body); 
    }
    else{
      data =await PostsModel.updateOne({_id:_idEdit},req.body);
    }
   
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});



module.exports = router;