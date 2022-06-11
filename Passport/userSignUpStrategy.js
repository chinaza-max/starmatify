const bcrypt = require("bcrypt");
const getConnection = require("../DB/mySql");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const Redis = require("ioredis");
//i use this random generator for storing users who has not yet activated there account
const { Entropy } = require('entropy-string')
const { uuid } = require('uuidv4');

const entropy = new Entropy()
const string = entropy.sessionID()

console.log(getConnection(callfu))
function callfu(w,e){
  console.log("==========="+e+"==========")
  console.log(w)
  console.log(e)
  console.log("==========="+e+"==========")
}

const redis = new Redis({
  port: 10699, // Redis port
  host: "redis-10699.c12.us-east-1-4.ec2.cloud.redislabs.com", // Redis host
  username: "default", // needs Redis >= 6
  password: "vr1ksiXL79YnSxirC7ROVPfNVrsSQOHo",
});

const maxNumberOfFailedLogins = 3;
const timeWindowForFailedLogins = 60 * 60 * 1;

const userSignUpLocalStrategy = new LocalStrategy(
  { usernameField: "tel", passwordField: "password", passReqToCallback: true },
  async (req, tel, password, done) => {
    //console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email;
    let reg = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      address:req.body.lastName,
      email: email,
      tel: tel,
      gender: req.body.gender,
      active:false
    };

    // conDB.query('SELECT * FROM Usuario WHERE Usuario = ? and Contra= ?',  [UsuarioReg,ContraReg]
    con.query(
      "SELECT * FROM userTable1 WHERE tel = ? or email= ?",
      [tel, email],
      function (err, rows) {
        if (err) {
            con.end();
          //return done({"payLoad":"data base error","status":false},null)
          return console.log(err);
        }
        //open later
        /*
                    let userAttempts = await redis.get(tel);
                    if (userAttempts > maxNumberOfFailedLogins) {
                        return done({"payLoad":"Too many request, please try again after an hour","status":false},null)
                    }
        
                    */
        if (!rows.length) {
            console.log(rows)
            
            con.query(
            "INSERT INTO userTable1 SET ?",
            reg,
            function (err, results) {
              if (err) {
                return done( "data base error",null);
              } else {
                //console.log(results);
                con.end();
                //open later
                //await redis.del(user.tel)

                let payload1 = { id: email, tel };
                let payload2 = { id: email };

                try {
                  jwt.sign(payload1,process.env.APP_PRIVATE_KEY_JWT,{ algorithm: "RS256", expiresIn: "5s" },
                    function (err, accessToken) {
                      if (err) {
                        //   throw err;
                        console.log(err)
                        return done("error implementing  jwt accessToken",null);
                      } else {
                            jwt.sign(payload2,process.env.APP_PRIVATE_KEY_JWT,{ algorithm: "RS256", expiresIn: "1y" },
                                function (err, refreshToken) {
                                    if (err) {
                                    //throw err;
                                    console.log(err)
                                    return done("error implementing  jwt refreshToken",null);
                                    } else {
                                    return done(null, {accessToken,refreshToken,payload2,});
                                    }
                                }
                            );
                        }
                    }
                  );
                } catch (e) {
                  console.log("check signUpStrategy file where the jwt is been signed");
                  // throw e
                  return done("error implementing  jwt ",null);
                }
              }
            }
          );
          
        } else {
          //open later
          // await redis.set(tel, ++userAttempts, 'ex', timeWindowForFailedLogins)
          return done("user already exit", null);
        }
      }
    );
  }
);

module.exports = userSignUpLocalStrategy;
