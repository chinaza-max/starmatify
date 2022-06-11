/*
1. ------------get account balance--------------
*/





const express=require("express")
const router=express.Router();
const verifyJWT=require("../middleware/deserializeJWT")
//const Wallet =require("../MongoDB/Models/wallet")
const Wallet =""
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true,httpOnly :true})

router.get("/wallet/:userId/balance",verifyJWT,async (req, res) => {
  const { userId } = req.params;

  try {

    if(req.userId==userId){
      const wallet = await Wallet.findOne({ userId });

      if(wallet){
        res.status(200).json({express:{"payLoad":wallet.balance,"status":true}})
      }
      else{
        res.status(200).json({express:{"payLoad":0,"status":true}})
      }
     
    }
    else{
      return  res.json({express:{"payLoad":'user needs to login',"status":false}})
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({express:{"payLoad":"server error","status":false}})
  }
});

//this route protect all form submission 
router.get('/form',csrfProtection,verifyJWT,function (req, res) {
   // pass the csrfToken to the view
  return  res.status(200).json({express:{"payLoad":req.csrfToken() ,"status":true}})
})


  module.exports = router ;