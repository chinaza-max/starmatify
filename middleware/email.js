require('dotenv').config(); 
const nodemailer=require('nodemailer');





let auth = {
    type: 'oauth2',
    user: 'chinazaogbonna10000@gmail.com',
    clientId: '5915305382-ajjjt5nkov98je8310rjbum7t8348lqr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04ftIlChZRgVOCgYIARAAGAQSNwF-L9IrWARLRbiT1EcIlqIxpoG-jVeGtf8qHrRDjBRZyirEQ3eZZosX8V6Fzky6FMBrSJeIWyM',
};

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:auth
});

const sendMail=(email,subject,text,id,cb)=>{

    let mailOptions='';

    if(subject="QOUTE FROM STARMATIFY"){

         mailOptions={
            from:"chinazaogbonna10000@gmail.com",
            to:email,
            subject,
            text,
            html:`      <div style="width: 90%; margin: 0 auto;">
                            <div style="text-align: center;">----------------------------------------- </div>
                                <h2 style="text-align: center;">${text}</h2>
                            <div style="text-align: center;">----------------------------------------- </div>
                        
                            <p style="text-align: center;">your are welcome </p>
                            <div style="text-align: center;"><a href=http://localhost:5000/verifyUserEmail/${id}> ${text}</a> </div>
                        </div>`,
            attachments: [
                {
                    filename: "qoute.pdf",
                    path:  `starmatifyP/../client/public/uploads/QoutePDF/${id}`,
                },
                ],
        }
    }
   else{

    mailOptions={
        from:"chinazaogbonna10000@gmail.com",
        to:email,
        subject,
        text,
        html:`     <div style="width: 90%; margin: 0 auto;">
                        <div style="text-align: center;">----------------------------------------- </div>
                            <h2 style="text-align: center;">${text}</h2>
                        <div style="text-align: center;">----------------------------------------- </div>
                    
                        <p style="text-align: center;">your are welcome </p>
                        <div style="text-align: center;"><a href=http://localhost:5000/verifyUserEmail/${id}> ${text}</a> </div>
                    </div>`,
    }
    
   }
    
    transporter.sendMail(mailOptions,function(err,data){

            if(err){
                console.log(err)
              return  cb(err,null)
            }
            else{
                return  cb(null,data)
            }
    });
    
}

module.exports=sendMail;


