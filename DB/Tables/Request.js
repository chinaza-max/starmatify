let getConnection = require('../mySql');
  

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
      
      let sql=`CREATE TABLE IF NOT EXISTS Request1(
        requestId VARCHAR(30) NOT NULL,
        firstName VARCHAR(15) NOT NULL,
        email VARCHAR(30),
        tel VARCHAR(15) NOT NULL,
        detail JSON DEFAULT NULL,
        accountStatus VARCHAR(15) NOT NULL,
        status VARCHAR(5) NOT NULL,
        PRIMARY KEY (requestId),
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`;
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======Request1 table availeble========");
    });
  }
})
