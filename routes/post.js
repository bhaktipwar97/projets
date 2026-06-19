const express=require('express');//.............
const router=express.Router();




// posts
router.get("/",(req,res)=>{
    res.send("get for posts");
})

//show
router.get("/:id",(req,res)=>{
    res.send("get for show posts id");
})


// post
router.post("/",(req,res)=>{
    res.send("postr for posts");
})


//delete
router.delete("/:id",(req,res)=>{
    res.send("deleter for posts");
})



module.exports=router;