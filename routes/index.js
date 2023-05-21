const express= require("express");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Api roi work"});
})


module.exports = router;