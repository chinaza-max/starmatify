const Cookie = require('cookie')
const jwt = require('jsonwebtoken');



 function deserializeJWT(req,res,next){
    
    let cookies=Cookie.parse(req.headers.cookie || '');
  // console.log(cookies)

    //this condition check if user cookie exist if not user have to login
    if(Object.keys(cookies).length === 0 && cookies.constructor === Object||cookies==""){
       // return  res.json({express:{"payLoad":'user needs to login',"status":false}})
        return  res.status(403).json({express:{"payLoad":'user needs to login',"status":false}})
    }
    else{
        if(cookies.accessToken){
            let userObj = JSON.parse(cookies.accessToken)
            let accessToken = userObj.Token
    
            jwt.verify(accessToken,process.env.APP_PUBLIC_KEY_JWT,{ algorithms: ['RS256'] },function(err, decoded) {
                if(err){
                
                    if(err.name == "TokenExpiredError"){
                        let userObj = JSON.parse(cookies.refreshToken)
                        let refreshToken = userObj.Token
                        jwt.verify(refreshToken,process.env.APP_PUBLIC_KEY_JWT,{ algorithms: ['RS256'] },function(err, decoded) {
                            if(err){
                                if(err.name=="TokenExpiredError"){
                                    return  res.json({express:{"payLoad":'user needs to login',"status":false}})
                                }
                                else{
                                  //  throw err
                                }
                            }
                            else{
                                let payload1={"id":decoded.id}
                                jwt.sign(payload1,process.env.APP_PRIVATE_KEY_JWT, { algorithm: 'RS256',expiresIn: '1y'}, function(err,accessToken) {
                                    if(err)throw err;
                                    else{
                                        res.setHeader('Set-Cookie', Cookie.serialize('accessToken',JSON.stringify({"Token":accessToken}), {
                                            httpOnly: true,
                                        }));
                                        req.userId = decoded.id;
                                        return next()
                                    }
                                });
                            }
                        });
                    }
                    else{
                      //  throw err
                      
                    }
                }
                else{
                    req.userId=decoded.id;
                    return next()
                }
            });
        }
        else{
            return  res.status(403).json({express:{"payLoad":'user needs to login',"status":false}})
        }
    }
}


module.exports =deserializeJWT