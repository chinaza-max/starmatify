/*

1. ------------update user account-------------
2. ---------request Request for login users -------------
3. ---------request Request for logout users -------------
3. ---------request Request for logout users -------------

*/


const express=require("express");
const bcrypt=require('bcrypt');
const router=express.Router();
const verifyJWT=require("../middleware/deserializeJWT");
const getConnection = require("../DB/mySql");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true,httpOnly :true})
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { v4: uuid } = require('uuid')
const generatePDF = require('../middleware/generatePDF')
const sendMail=require("../middleware/email")
const path = require('path');
const fs=require('fs');


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
router.post('/signUPuser/:userId/Request',verifyJWT,async(req, res)=>{
    const { userId} = req.params;

    if(req.userId==userId){
    
        const id=uuid();
        let reg = {
            requestId:id,
            firstName: req.body.firstName,
            email: req.body.email,
            detail: '[{"screen": "40 inch", "resolution": "1920 x 1080 pixels", "ports": {"hdmi": 1, "usb": 2}, "speakers": {"left": "10 watt", "right": "10 watt"}}]',
            accountStatus:true,
            status:false
          }

        getConnection((err,con)=>{
            if(err){
                return res.status(500).send("error with dataBase1 ",null);
            }
            else{
                con.query("INSERT INTO Request1 SET ?",reg,function (err, results) {
                    if (err) {
                        con.release();
                        return  res.status(500).json({express:{payLoad:"error from server",status:false}})
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
router.post('/user/Request',async(req, res)=>{
    

    //status it indicate if your request has been responded to;

        const id=uuid();
        let reg = {
            requestId:id,
            firstName: req.body.firstName,
            email: req.body.email,
            tel: req.body.tel,
            detail: '[{"screen": "40 inch", "resolution": "1920 x 1080 pixels", "ports": {"hdmi": 1, "usb": 2}, "speakers": {"left": "10 watt", "right": "10 watt"}}]',
            accountStatus:false,
            status:false
        }
        getConnection((err,con)=>{
            if(err){
                return res.status(500).send("error with dataBase con",null);
            }
            else{
                con.query("INSERT INTO Request1 SET ?",reg,function (err, results) {
                    if (err) {
                        con.release();
                        console.log(err)
                        return  res.status(500).json({express:{payLoad:"error with dataBase request",status:false}})
                    } 
                    else {
                        /*
                        con.query("SELECT * FROM Quote1",(er,re)=>{
                        if(er)throw er
                        console.log(re)
                        })
                        */
                        con.release();
                        return  res.status(200).json({express:{payLoad:"your request has been sent you will get a response shortly via email or create an account to review qoute",status:true}})
                    }
                });
            }
        })

})

router.post('/Admin/:adminId/sendQoute',verifyJWT,csrfProtection,async(req, res)=>{
 
    const subject="QOUTE FROM STARMATIFY";
    const text= "thanks for choosing  us as"
  //  let path1 = path.relative("starmatifyP", "client/uploads");
   // console.log(path1)
  
    const pdfName=req.body.pdfName

    if(req.body.pdfName){
        const {adminId} = req.params;
        if(req.userId==adminId){
        
            const id=uuid();
            const email=req.body.email

            console.log()
            let detail=JSON.stringify(req.body.detail)
            let reg = {
                qouteId:id,
                firstName: req.body.firstName,
                email,
                detail,
                pdfName,
                acceptStatus:false
              }
    //'[{"screen": "40 inch", "resolution": "1920 x 1080 pixels", "ports": {"hdmi": 1, "usb": 2}, "speakers": {"left": "10 watt", "right": "10 watt"}}]'
            getConnection((err,con)=>{
                if(err){
                    return res.status(500).send("error with dataBase1 ",null);
                }
                else{
                 
                    con.query("INSERT INTO Quote1 SET ?",reg, function (err, results) {
                        if (err) {
                            con.release();
                            console.log(err)
                            return  res.status(500).json({express:{payLoad:"error from server",status:false}})
                        } 
                        else {
                           sendMail(email,subject,text,pdfName,(err,data)=>{
                            if(err){
                                return  res.status(500).json({express:{payLoad:"encounter error sending email",status:false}})
                            }
                            else{
                                con.release();
                                return  res.status(200).json({express:{payLoad:"your qoute has been sent you will get a response shortly via email or check your for more detail",status:true}})
                            }
                          })
    
                          
                        }
                   });
                }
            })
          
        }
    }
    else{
        return  res.status(200).json({express:{payLoad:"kindly view the pdf before sending",status:true}})
    }
  
      
})


router.post('/Admin/:adminId/viewQoute',verifyJWT,csrfProtection,async(req, res)=>{
    const pdfName =uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    
    const {adminId} = req.params;
    if(req.userId==adminId){
       
    //    doc.pipe(fs.createWriteStream(`starmatifyP/../client/public/uploads/QoutePDF/${pdfName}.pdf`));
     //   doc.text('Some awesome example text doc is not defined doc is not defined')
    

        const invoiceData = {
            addresses: {
                shipping: {
                    name: 'John Doe',
                    address: '2400 Fulton Street',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                    postalCode: 94118
                },
                billing: {

                    address: '3rd Floor, No. 22,, Koforidua StreetZone 2,\n Wuse, Abuja, Nigeria',
                }
            },
            memo: 'As discussed',
            items: [{
                    itemCode: 12341,
                    description: 'Laptop Computer',
                    quantity: 2,
                    price: 3000,
                    amount: 6000
            }, {
                    itemCode: 12342,
                    description: 'Printer',
                    quantity: 1,
                    price: 2000,
                    amount: 2000
                }
            ],
            subtotal: 8000,
            paid: 0,
            invoiceNumber: 1234,
            dueDate: 'Feburary 02, 2021'
        }
        const pdf = new generatePDF(invoiceData,pdfName)
        pdf.generate()

        return  res.status(200).json({express:{payLoad:`${pdfName}.pdf`,status:true}})
    }
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



//https://www.javatpoint.com/mysql-on-delete-cascade#:~:text=ON%20DELETE%20CASCADE%20clause%20in,related%20to%20the%20foreign%20key.