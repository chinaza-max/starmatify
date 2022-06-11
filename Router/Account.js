/*

1.   --------sign up route---------
2.   ---------login route----------

*/




const express=require("express")
const passport=require('passport')
const rateLimit = require('express-rate-limit')
const Cookie = require('cookie')
const router=express.Router();
const axios = require('axios');
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

//loginSignUpRateLimiter
router.post('/userSignUp',(req, res, next)=>{
    passport.authenticate("local-userSignUp",(err, user, info) =>{
        if (err) {
            console.log("chinaza")
            return res.status(400).json({express:{"payLoad":err,"status":false}})
        }
        res.setHeader('Set-Cookie', Cookie.serialize('accessToken',JSON.stringify({"Token":user.accessToken}),{
            httpOnly: true,
        }));

        
        res.setHeader('Set-Cookie', Cookie.serialize('refreshToken',JSON.stringify({"Token":user.refreshToken}), {
            httpOnly: true,
        }));
    
        //user id(from mongoDB) is sent back;
        return res.status(200).json({express:{"payLoad":user.payload2,"status":true}})
    })(req, res, next)
})

//loginSignUpRateLimiter
router.post('/login',(req, res, next)=>{
    passport.authenticate("local-login",(err, user, info) =>{
        if (err) {
            //return res.status(400).json({express:err})
            return res.status(400).json({express:{"payLoad":err,"status":false}})
        }

        res.setHeader('Set-Cookie', Cookie.serialize('accessToken',JSON.stringify({"Token":user.accessToken}), {
            httpOnly: true,
        }));

        res.setHeader('Set-Cookie', Cookie.serialize('refreshToken',JSON.stringify({"Token":user.refreshToken}), {
            httpOnly: true,
        }));

        //user id(from mongoDB) is sent back;
        return res.status(200).json({express:{"payLoad":user.payload2,"status":true}})
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

module.exports=router;

