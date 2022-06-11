const bcrypt=require('bcrypt');
//const User='require("../MongoDB/Models/users")'
const User=""
const jwt = require('jsonwebtoken');
const LocalStrategy=require('passport-local').Strategy
const Redis = require('ioredis');
const { connect } = require('../DB/mySql');


const redis = new Redis({
    port: 10699, // Redis port
    host: "redis-10699.c12.us-east-1-4.ec2.cloud.redislabs.com", // Redis host
    username: "default", // needs Redis >= 6
    password: "vr1ksiXL79YnSxirC7ROVPfNVrsSQOHo",
  });
const maxNumberOfFailedLogins = 3;
const timeWindowForFailedLogins = 60 * 60 * 1


const loginLocalStrategy=new LocalStrategy({usernameField: 'tel',
passwordField: 'password',passReqToCallback: true},(req,tel,password,done)=>{
   
    if(typeof tel=="number"){
        User.findOne({tel},async(err,user)=>{
       
            if(err){
                return done(err);
            }
            
            //open later
            /*
            let userAttempts = await redis.get(tel);
            if (userAttempts > maxNumberOfFailedLogins) {
                return done({"payLoad":"Too many request, please try again after an hour","status":false},null)
            }
          */
            if(user==null){
                
                //open later
               // await redis.set(tel, ++userAttempts, 'ex', timeWindowForFailedLogins)
                return done({"payLoad":'user not found',"status":false},null)
    
            }
            try{
                
                if(await bcrypt.compare(password,user.password)){
    
                    //open later
                  //  await redis.del(user.tel)
    
                    let payload1={"id":user.id,"tel":user.tel}
                    let payload2={"id":user.id}
                    try{
                        jwt.sign(payload1,process.env.APP_PRIVATE_KEY_JWT, { algorithm: 'RS256',expiresIn: '1y'}, function(err,accessToken) {
                            if(err)throw err;
                            else{
                                jwt.sign(payload2,process.env.APP_PRIVATE_KEY_JWT, { algorithm: 'RS256',expiresIn: '1y'}, function(err,refreshToken) {
                                    if(err){
                                       // throw err;
                                    }
                                    else{
                                        return done(null,{accessToken,refreshToken,payload2})
                                    }
                                });
                            }
                        });
                    }catch(e){
                        console.log("check loginLocalStrategy file where the jwt is been signed")
                      //  throw e
                    }
                } 
                else{
                    return done({"payLoad":'user not found',"status":false},null)
                }
            } catch(e){
                    return done(e)
            }
        })
    }
    else{
        return done({"payLoad":"invalid input","status":false},null)
    }

})

module.exports=loginLocalStrategy;