const bcrypt=require('bcrypt');
//const User='require("../MongoDB/Models/users")'
const getConnection = require("../DB/mySql");
const jwt = require('jsonwebtoken');
const LocalStrategy=require('passport-local').Strategy
const Redis = require('ioredis');

/*
const redis = new Redis({
    port: 10699, // Redis port
    host: "redis-10699.c12.us-east-1-4.ec2.cloud.redislabs.com", // Redis host
    username: "default", // needs Redis >= 6
    password: "vr1ksiXL79YnSxirC7ROVPfNVrsSQOHo",
  });

  */

const maxNumberOfFailedLogins = 3;
const timeWindowForFailedLogins = 60 * 60 * 1


const userLoginLocalStrategy=new LocalStrategy({usernameField: 'email',
passwordField: 'password',passReqToCallback: true},(req,email,password,done)=>{
   
    getConnection((err,con)=>{
        if(err){
            console.log(err);
          return done("error with db ",null);
        }
        else{
          con.query("SELECT * FROM userTable2  WHERE email = ?",
          [email],
         async function (err, result, fields) {
            if(err){
                console.log(err);
                con.release();
                return done("error with db ",null);
            }

              //open later
            /*
            let userAttempts = await redis.get(tel);
            if (userAttempts > maxNumberOfFailedLogins) {
                return done({"payLoad":"Too many request, please try again after an hour","status":false},null)
            }
          */
           
            if(!result.length||result[0].active==0){
                  //open later
               // await redis.set(tel, ++userAttempts, 'ex', timeWindowForFailedLogins)
               return done('user not found',null)
            }
            else{
                con.release();
                try{
                   
                    if(await bcrypt.compare(password,result[0].password)){
        
                        //open later
                      //  await redis.del(user.tel)
        
                        let payload1={"id":result[0].userId,"tel":result[0].tel}
                        let payload2={"id":result[0].userId}
                        try{
                            jwt.sign(payload1,process.env.APP_PRIVATE_KEY_JWT, { algorithm: 'RS256',expiresIn: '5s'}, function(err,accessToken) {
                                if(err){
                                    console.log(err);
                                    return done('error from server accessToken key',null)
                                }
                                else{
                                    jwt.sign(payload2,process.env.APP_PRIVATE_KEY_JWT, { algorithm: 'RS256',expiresIn: '1y'}, function(err,refreshToken) {
                                        if(err){
                                            console.log(err);
                                            return done('error from server refreshToken key',null)
                                        }
                                        else{
                                            return done(null,{accessToken,refreshToken,payload2})
                                        }
                                    });
                                }
                            });
                        }catch(e){
                            console.log("check loginLocalStrategy file where the jwt is been signed")
                            console.log(e)
                            return done('error from server jwt',null)
                        }
                    } 
                    else{
                        return done('user not found',null)
                    }
                
                } catch(e){
                        return done(e)
                }
            }
          });
        }
    })
})

module.exports=userLoginLocalStrategy;