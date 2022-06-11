/*
1. ------------update user account-------------
2. ------------update pin for bank-------------
3. ------------update recoveryQuestion---------

*/


const express=require("express");
const bcrypt=require('bcrypt');
const router=express.Router();
const verifyJWT=require("../middleware/deserializeJWT");
//const User=require("../MongoDB/Models/users");
const User=''
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true,httpOnly :true})

router.post('/user/:userId/update',verifyJWT,csrfProtection,async(req, res)=>{
    const { userId } = req.params;

    if(req.userId==userId){
        const hashedPassword=await bcrypt.hash( req.body.password,10)
        const update = { "$set": { "firstName": req.body.firstName,"password":hashedPassword, "dateOfBirth":req.body.dateOfBirth, "email":req.body.email, "tel":req.body.tel, "gender":req.body.gender}}       
       
        User.findOneAndUpdate({_id:userId},update,{new: true}).exec(function(err, doc){
            if(err) {
                //console.log(err);
                //res.status(500).send(err);
                return res.status(500).json({express:{"payLoad":"server error","status":false}})
            } else {
                    res.status(200).json({express:doc});
            }
        });
    }
    else{
        return  res.json({express:{"payLoad":'user needs to login',"status":false}})
    }
   
})


router.post('/user/:userId/update/pin',verifyJWT,csrfProtection,async(req, res)=>{
    const { userId } = req.params;

    if(req.userId==userId){
        const update = { "$set": { "pin": req.body.pin}}       
       
        User.findOneAndUpdate({_id:userId},update, {new: true}).exec(function(err, doc){
            if(err) {
                //console.log(err);
                //res.status(500).send(err);
                return res.status(500).json({express:{"payLoad":"server error","status":false}})
                
            } else {
                res.status(200).json({express:{"payLoad":{"id":doc.id,"pin":doc.pin},"status":true}});
            }
        });
    }
    else{
        return  res.status(403).json({express:{"payLoad":'user needs to login',"status":false}})
    }
})

router.post('/user/:userId/update/recoveryQuestion',verifyJWT,csrfProtection,async(req, res)=>{
    const { userId } = req.params;

    if(req.userId==userId){
        const update = { "$set": { "pin": req.body.pin}}       
       
        User.findOneAndUpdate({_id:userId},update, {new: true}).exec(function(err, doc){
            if(err) {
                //console.log(err);
                //res.status(500).send(err);
                return res.status(500).json({express:{"payLoad":"server error","status":false}})
            } else {
                res.status(200).json({express:{"payLoad":{"id":doc.pin,"pin":doc.id},"status":true}});
            }
        });
    }
    else{
        return  res.status(403).json({express:{"payLoad":'user needs to login',"status":false}})
    }
   
})
module.exports = router;