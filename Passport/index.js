const passport=require('passport')
//const User=require("../MongoDB/Models/users")
const userSignUpStrategy=require("./userSignUpStrategy")
const userLoginStrategy=require("./userLoginStrategy")
const adminLoginStrategy=require("./adminLoginStrategy")


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
passport.use("local-userLogin",userLoginStrategy)
passport.use("local-adminLogin",adminLoginStrategy)

module.exports=passport;