let getConnection = require('../mySql');



getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
  
    let sql=`CREATE TABLE IF NOT EXISTS service1(
      serviceId VARCHAR(30) NOT NULL,
      name VARCHAR(15) NOT NULL,
      PRIMARY KEY (serviceId),
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======service1 table availeble========");
    });
  }
})
