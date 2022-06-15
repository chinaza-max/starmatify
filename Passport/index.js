const passport=require('passport')
//const User=require("../MongoDB/Models/users")
const userSignUpStrategy=require("./userSignUpStrategy")
const userLoginStrategy=require("./userLoginStrategy")



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

module.exports=passport;