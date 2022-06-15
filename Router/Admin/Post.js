/*

1. ------------update user account-------------
2. ---------request qoute for login users -------------
3. ---------request qoute for logout users -------------

*/

const express=require("express");
const bcrypt=require('bcrypt');
const router=express.Router();
const verifyJWT=require("../../middleware/deserializeJWT");
const getConnection = require("../../DB/mySql");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true,httpOnly :true})

router.post('/testAdmin',async(req, res)=>{
    
    console.log("chinazs")
    let reg = {
        name: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
        AdminType:req.body.AdminType
    };

    getConnection((err,con)=>{
        if(err){
            return  res.status(500).json({express:{payLoad:"error from server ",status:false}})
        }
        else{
            con.query("INSERT INTO Admin SET ?",reg,function (err, results) {
                if (err) {
                  con.release();
                  return  res.status(500).json({express:{payLoad:"error from db",status:false}})
                } 
                else {
                  con.release();
                  return  res.status(200).json({express:{payLoad:"registration successfull",status:true}})
                }
              }
            );
        }
    })
})

//receive quote when user has signed up
router.post('/signUPuser/:userId/quote',verifyJWT,async(req, res)=>{

    if(req.userId==userId){
    
        let reg = {
            name: req.body.firstName,
            email: req.body.lastName,
            details: req.body.details,
            accountStatus:true,
            status:false
          };

          con.query("INSERT INTO Quote1 SET ?",reg,function (err, results) {
                if (err) {
                    con.release();
                    return  res.status(500).json({express:{payLoad:"error from server",status:true}})
                } 
                else {
                    con.release();
                    return  res.status(200).json({express:{payLoad:"your qoute has been sent you will get a response shortly via email or check your for more detail",status:true}})
                }
          });
    }
    else{
        return  res.json({express:{"payLoad":'user needs to login',status:false}})
    }
})
//receive quote when user has not signed up
router.post('/user/quote',async(req, res)=>{

        let reg = {
            name: req.body.firstName,
            email: req.body.lastName,
            details: req.body.details,
            accountStatus:false,
            status:false
          };
          con.query("INSERT INTO Quote1 SET ?",reg,function (err, results) {
            if (err) {
              con.release();
            return  res.status(500).json({express:{payLoad:"error from server",status:true}})
            } 
            else {
              con.release();
              return  res.status(200).json({express:{payLoad:"your qoute has been sent you will get a response shortly via email or create an account to review qoute quote ",status:true}})
            }
          }
        );
      
 
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