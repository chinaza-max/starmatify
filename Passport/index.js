const passport=require('passport')
//const User=require("../MongoDB/Models/users")
const userSignUpStrategy=require("./userSignUpStrategy")
const loginStrategy=require("./loginStrategy")



/*
passport.serializeUser((user,done)=>done(null,user.id))
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if(err){return done(err)}
        done(null,user)
    })
})
*/

passport.use("local-userSignUp",userSignUpStrategy)
passport.use("local-login",loginStrategy)

module.exports=passport