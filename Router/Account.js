/*

1.   --------Usersign up route---------
2.   ---------Userlogin route----------
3.   ---------adminLogin------
4.   ---------verifyUserEmail------


*/

const express=require("express")
const passport=require('passport')
const rateLimit = require('express-rate-limit')
const Cookie = require('cookie')
const router=express.Router();
const axios = require('axios');
const getConnection = require("../DB/mySql");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();



//const User=require("../MongoDB/Models/users")
//const Wallet=require("../MongoDB/Models/wallet")
//const WalletTransaction=require("../MongoDB/Models/wallet_transaction")
//const Transaction=require("../MongoDB/Models/transaction")
const User=""
const Wallet=""
const WalletTransaction=''
const Transaction=''




// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html


const loginSignUpRateLimiter = rateLimit(
                            {   max: 3, 
                                windowMS: 60 * 60 * 1000 ,
                                message:{"express":{"payload":"Too many request, please try again after an hour","status":false}}
                            })



function test(req,res){
        console.log("chinaza")
       // console.log(req.body)
}


router.get('/verifyUserEmail/:id',async (req, res)=>{
  
  let hash=req.params.id
  getConnection((err,con)=>{
    if(err){
      return res.status(500).send("error with dataBase1 ",null);
    }
    else{
      con.query("SELECT userId FROM activateAccount WHERE hash = ?", [hash] , function (error, results, fields) {
        if(error){
          con.release();
          return res.status(500).send("error with dataBase ");
        }
        else{
          if(!results.length){
            res.status(200).send("account has been activated already");
          }
          else{
            let userId=results[0].userId
            con.query("UPDATE userTable2 SET active = true WHERE userId = ?", [userId] , function (error, results, fields) {
              if(error){
                con.release();
                return res.status(500).send("error with dataBase");
              }
              else{
                console.log("kkkkoo")
                con.query("DELETE FROM activateAccount WHERE hash = ?", [hash] , function (error, results, fields) {
                  if(error){
                    con.release();
                    return res.status(500).send("error with dataBase");
                  }
                  else{
                    console.log("==========hash=================")
                    removeDuplicateAcc()
                    con.release();
                    return res.status(200).send("<h2 style='text-align:center'>your account have been succesfully activate goback to site and login</h2>");
                  }        
                })   
              }        
            })
          }
        }        
     })
    }
  })

})


//loginSignUpRateLimiter
router.post('/userSignUp',(req, res, next)=>{
    passport.authenticate("local-userSignUp",(err, message, info) =>{
        if (err) {
            return res.status(400).json({express:{payLoad:err,status:false}})
        }

        return res.status(200).json({express:{payLoad:message,status:true}})
    })(req, res, next)
})



//loginSignUpRateLimiter
router.post('/userLogin',(req, res, next)=>{
    passport.authenticate("local-userLogin",(err, user, info) =>{
        if (err) {
            //return res.status(400).json({express:err})
            return res.status(400).json({express:{"payLoad":err,"status":false}})
        }

        res.setHeader('Set-Cookie', Cookie.serialize('accessToken',JSON.stringify({"Token":user.accessToken}), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 
        }));
/*
        res.setHeader('Set-Cookie', Cookie.serialize('refreshToken',JSON.stringify({"Token":user.refreshToken}), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 
        }));
        */
        return res.status(200).json({express:{"payLoad":user.payload2,"status":true}})
    })(req, res, next)
})



router.post('/adminLogin',(req, res, next)=>{
  passport.authenticate("local-adminLogin",(err, user, info) =>{
      if (err) {
          //return res.status(400).json({express:err})
          return res.status(400).json({express:{payLoad:err,status:false}})
      }

      res.setHeader('Set-Cookie', Cookie.serialize('accessToken',JSON.stringify({"Token":user.accessToken}), {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7 
      }));
/*
      res.setHeader('Set-Cookie', Cookie.serialize('refreshToken',JSON.stringify({"Token":user.refreshToken}), {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7 
      }));
      */

      /*
        REASON 
        when client hit this route without password and user name 
        the user is threated like an authenticated user 
        and get the res 200 but no payload(payload will be empty because it an 
          invalid user)

      */
      if(user.AdminDetails){
        return res.status(200).json({express:{payLoad:user.AdminDetails,status:true}})
        
      }else{
        return res.status(200).json({express:{payLoad:"no user found",status:false}})
      }
  
     
  })(req, res, next)
})














































































router.get("/response", async (req, res) => {
    const { transaction_id } = req.query;
  
    // URL with transaction ID of which will be used to confirm transaction status
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
  
    try{
         // Network call to confirm transaction status
    const response = await axios({
        url,
        method: "get",
        cancelToken: source.token,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
        },
    });

    source.cancel('Operation canceled by the user.');
    
    const { status, currency, id, amount, customer } = response.data.data;

     // check if transaction id already exist;
    const transactionExist = await Transaction.findOne({ transactionId: id });
    if (transactionExist) {
      return res.status(409).send("Transaction Already Exist");
    }

    // check if customer exist in our database
    const user = await User.findOne({ email: customer.email });

    // check if user have a wallet, else create wallet
    const wallet = await validateUserWallet(user._id);

    // create wallet transaction
    await createWalletTransaction(user._id, status, currency, amount);

    // create transaction
    await createTransaction(user._id, id, status, currency, amount, customer);

    await updateWallet(user._id, amount);

    return res.status(200).json({
        response: "wallet funded successfully",
        data: wallet,
    });
    }
    catch(e){
        console.log("check file Account.js ")
        throw e
    }
 

  });

  async function  validateUserWallet(userId){
    try {
        // check if user have a wallet, else create wallet
         const userWallet = await Wallet.findOne({ userId });
  
        // If user wallet doesn't exist, create a new one
      if (!userWallet) {
        // create wallet
        const wallet = await Wallet.create({
          userId,
        });
        return wallet;
      }
      return userWallet;
    } catch (error) {
        console.log(error);
    }
  };
  
  // Create Wallet Transaction
  async function createWalletTransaction(userId, status, currency, amount){
    try {
      // create wallet transaction
      const walletTransaction = await WalletTransaction.create({
        amount,
        userId,
        isInflow: true,
        currency,
        status,
      });
      return walletTransaction;
    } catch (error) {
      console.log(error);
    }
  };
  
  // Create Transaction
  async function  createTransaction(userId,id,status,currency,amount,customer){
    try {
      // create transaction
      const transaction = await Transaction.create({
        userId,
        transactionId: id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone_number,
        amount,
        currency,
        paymentStatus: status,
        paymentGateway: "flutterwave",
      });
      return transaction;
    } catch (error) {
      console.log(error);
    }
  };
  
  // Update wallet 
  async function updateWallet(userId, amount){
    try {
      // update wallet
      const wallet = await Wallet.findOneAndUpdate(
        { userId },
        { $inc: { balance: amount } },
        { new: true }
      );
      return wallet;
    } catch (error) {
      console.log(error);
    }
  };





//this function remove duplicate account from db
function removeDuplicateAcc(){
  getConnection((err,con)=>{
    if(err){
      console.log("error with dataBase when clearing duplicates ");
    }
    else{
      con.query("SELECT * FROM activateAccount", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(!result.length){

        }
        else{
          for(let i=0;i<result.length;i++){
          
            let date = new Date();
            let timeLimit = new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000)).getTime();
            let time = new Date(result[i].reg_date).getTime();
            console.log(timeLimit>time)
            if(timeLimit>time){
              con.query("DELETE FROM activateAccount WHERE userId = ?", [result[i].userId] , function (error, results, fields) {
                if(error){                                                                                                                                                                     
                  con.release();
                  console.log(error);
                }
                else{
                  con.query("DELETE FROM userTable2 WHERE userId = ?", [result[i].userId] , function (error, results, fields) {
                    if(error){                                                                                                                                                                     
                      con.release();
                      console.log(error);
                    }
                    else{
                      console.log("duplicate removed")
                    }        
                  })
                }        
              }) 
            }
            if(i==result.length-1){
              con.release()
            }
          }
        }
      });
    }
  })
}
module.exports=router;

