/*

1. ------------update user account-------------
2. ---------request qoute for login users -------------
3. ---------request qoute for logout users -------------

*/


const express=require("express");
const bcrypt=require('bcrypt');
const router=express.Router();
const verifyJWT=require("../middleware/deserializeJWT");
const getConnection = require("../DB/mySql");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true,httpOnly :true})
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


router.post('/user/:userId/update',verifyJWT,csrfProtection,async(req, res)=>{
    const { userId} = req.params;
    
   
    if(req.files==null){
        console.log(req.userId)
        if(req.userId==userId){
            const hashedPassword=await bcrypt.hash( req.body.password,10)
            let update = [
                req.body.firstName,
                req.body.lastName,
                hashedPassword,
                req.body.address,
                req.body.tel,
                req.body.gender,
                userId
            ]
            getConnection((err,con)=>{
                if(err){
                  return res.status(500).send("error with dataBase1 ",null);
                }
                else{
                    con.query("UPDATE userTable2 SET firstName=?, lastName=?, password=?, address=?, tel=?, gender=? WHERE userId = ?",update, function (error, results, fields) {
                        if(error){
                            console.log(error)
                            con.release();
                         console.log("na here")
                          return res.status(500).json({express:{payLoad:"error with dataBase",status:false}});
                        }
                        else{
                            return  res.json({express:{"payLoad":'successfully updated',status:true}})
                        }        
                    })
                }
            })
          
        }
        else{
            return  res.status(400).json({express:{payLoad:'user needs to login',status:false}})
        }
    }
    else{

        console.log("========userId============")
        let file=req.files.file
        console.log(file)
        if(file.mimetype.toLowerCase()=="image/jpeg"||file.mimetype.toLowerCase()=="image/png"||file.mimetype.toLowerCase=="image/jpg"){
            const randomName =uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
            const avatar=randomName+'.'+(file.mimetype.slice(6, 10))
            if(req.userId==userId){
                const hashedPassword=await bcrypt.hash( req.body.password,10)
                let update = [
                    req.body.firstName,
                    req.body.lastName,
                    hashedPassword,
                    req.body.address,
                    req.body.tel,
                    req.body.gender,
                    avatar,
                    userId
                ]
                getConnection((err,con)=>{
                    if(err){
                      return res.status(500).send("error with dataBase1 ",null);
                    }
                    else{
    
                        if(req.body.bookName){
                            const dir = `${__dirname}/client/public/uploads/${req.body.bookName}`;
                            fs.unlinkSync(dir)
                        }
                       
                        con.query("UPDATE userTable2 SET firstName=?, lastName=?, password=?, address=?, tel=?, gender=? , avatar=? WHERE userId = ?",update, function (error, results, fields) {
                            if(error){
                                console.log(error)
                              con.release();
                             
                              return res.status(500).json({express:{payLoad:"error with dataBase",status:false}});
                            }
                            else{
                                file.mv(`${__dirname}/client/public/uploads/${avatar}`, err => {
                                    if (err) {
                                    return res.status(500).json({express:{payload:"error from server"},status:false});
                                    }
                                    else{
                                        return  res.json({express:{"payLoad":'successfully updated',status:true}})
                                    } 
                                });                                
                            }        
                        })
                    }
                })
            }
            else{
                return  res.status(400).json({express:{payLoad:'user needs to login',status:false}})
            }
        }
        else{
            res.status(400).json({express:{payload:"wrong file type uploaded accepted file type(image/jpeg,image/png,image/jpg)"},status:false})
        }
    }
 
})

//receive quote when user has signed up
router.post('/signUPuser/:userId/quote',verifyJWT,async(req, res)=>{

    if(req.userId==userId){
    
        let reg = {
            name: req.body.firstName,
            email: req.body.lastName,
            details: req.body.details,
            accountStatus:true,
            status:false
          };

        getConnection((err,con)=>{
            if(err){
                return res.status(500).send("error with dataBase1 ",null);
            }
            else{
                con.query("INSERT INTO Quote1 SET ?",reg,function (err, results) {
                    if (err) {
                        con.release();
                        return  res.status(500).json({express:{payLoad:"error from server",status:true}})
                    } 
                    else {
                        con.release();
                        return  res.status(200).json({express:{payLoad:"your qoute has been sent you will get a response shortly via email or check your for more detail",status:true}})
                    }
              });
            }
        })
      
    }
    else{
        return  res.json({express:{"payLoad":'user needs to login',status:false}})
    }
})
//receive quote when user has not signed up
router.post('/user/quote',async(req, res)=>{


    
        let reg = {
            name: req.body.firstName,
            email: req.body.lastName,
            details: req.body.details,
            accountStatus:false,
            status:false
          };
        getConnection((err,con)=>{
            if(err){
                return res.status(500).send("error with dataBase1 ",null);
            }
            else{
                con.query("INSERT INTO Quote1 SET ?",reg,function (err, results) {
                    if (err) {
                      con.release();
                      console.log(err)
                    return  res.status(500).json({express:{payLoad:"error from server",status:true}})
                    } 
                    else {
                      con.release();
                      return  res.status(200).json({express:{payLoad:"your qoute has been sent you will get a response shortly via email or create an account to review qoute quote ",status:true}})
                    }
                });
            }
        })

})





router.post('/user/:userId/update/pin',verifyJWT,csrfProtection,async(req, res)=>{
    const { userId } = req.params;

    if(req.userId==userId){
        const update = { "$set": { "pin": req.body.pin}}       
       
        User.findOneAndUpdate({_id:userId},update, {new: true}).exec(function(err, doc){
            if(err) {
                //console.log(err);
                //res.status(500).send(err);
                return res.status(500).json({express:{"payLoad":"server error","status":false}})
                
            } else {
                res.status(200).json({express:{"payLoad":{"id":doc.id,"pin":doc.pin},"status":true}});
            }
        });
    }
    else{
        return  res.status(403).json({express:{"payLoad":'user needs to login',"status":false}})
    }
})

router.post('/user/:userId/update/recoveryQuestion',verifyJWT,csrfProtection,async(req, res)=>{
    const { userId } = req.params;

    if(req.userId==userId){
        const update = { "$set": { "pin": req.body.pin}}       
       
        User.findOneAndUpdate({_id:userId},update, {new: true}).exec(function(err, doc){
            if(err) {
                //console.log(err);
                //res.status(500).send(err);
                return res.status(500).json({express:{"payLoad":"server error","status":false}})
            } else {
                res.status(200).json({express:{"payLoad":{"id":doc.pin,"pin":doc.id},"status":true}});
            }
        });
    }
    else{
        return  res.status(403).json({express:{"payLoad":'user needs to login',"status":false}})
    }
   
})








//https://www.sitepoint.com/use-json-data-fields-mysql-databases/


module.exports = router;