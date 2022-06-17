const bcrypt = require("bcrypt");
const getConnection = require("../DB/mySql");
const sendMail=require("../middleware/email")
//const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
//const Redis = require("ioredis");
//i use this random generator for storing users who has not yet activated there account
const { Entropy } = require('entropy-string')
const { v4: uuid } = require('uuid')

const entropy = new Entropy()


/*
const redis = new Redis({
  port: 10699, // Redis port
  host: "redis-10699.c12.us-east-1-4.ec2.cloud.redislabs.com", // Redis host
  username: "default", // needs Redis >= 6
  password: "vr1ksiXL79YnSxirC7ROVPfNVrsSQOHo",
});
*/
const maxNumberOfFailedLogins = 3;
const timeWindowForFailedLogins = 60 * 60 * 1;

const userSignUpLocalStrategy = new LocalStrategy(
  { usernameField: "tel", passwordField: "password", passReqToCallback: true },
  async (req, tel, password, done) => {
  
    const subject="ACTIVATE STARMATEFY ACCOUNT";
    const text="click to activate"
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const id=uuid();
    const hash=entropy.sessionID();
    const email = req.body.email||'';
    

    let reg = {
      firstName: req.body.firstName,
      lastName: req.body.lastName||"",
      password: hashedPassword||email,
      address:req.body.lastName||"",
      email: email,
      tel: tel,
      gender: req.body.gender||"",
      active:false,
      userId:id
    };
    let reg2={
      hash:hash,
      userId:id
    }
    getConnection((err,con)=>{
      if(err){
        return done("error with dataBase1 ",null);
      }
      else{
        con.query(
          "SELECT * FROM userTable2 WHERE tel = ? or email= ?",
          [tel, email],
          function (err, rows) {
            if (err) {
                con.release();
                console.log(err);
                return done("error with dataBase2 ",null);
            }
            //open later
            /*
                        let userAttempts = await redis.get(tel);
                        if (userAttempts > maxNumberOfFailedLogins) {
                            return done({"payLoad":"Too many request, please try again after an hour","status":false},null)
                        }
            
                        */
        
    
            if (!rows.length) {
              addNewUser(con,reg,id,email,tel)
            } 
            else {
              //open later
              // await redis.set(tel, ++userAttempts, 'ex', timeWindowForFailedLogins)
              for(let i=0;i<rows.length;i++){
                if(rows[i].active==1){
                  con.release();
                  return done("user already exit", null);
                }
                if(i==rows.length-1){
                  addNewUser(con,reg,id,email,tel)
                }
              }            
            }
          }
        )
      }
    
    })


    function addNewUser(con,reg,id,tel,){
      con.query("INSERT INTO userTable2 SET ?",reg,function (err, results) {
          if (err) {
            con.release();
            return done( "data base error",null);
          } 
          else {
              con.query("INSERT INTO activateAccount SET ?",reg2,
                function (err, results) {
                  if (err) {
                    con.release();
                    return done( "data base error",null);
                  } 
                  else {
                    sendMail(email,subject,text,hash,(err,data)=>{
                      if(err){
                          return done( "internal error",null);
                      }
                      else{
                          return done(null,"go to your email address and activate your account");
                      }
                    })
                   
                  }
              })
            con.release();
            //open later
            //await redis.del(user.tel)
          }
        }
      );
    }
  }
);

module.exports = userSignUpLocalStrategy;
