let getConnection = require('../mySql');
  

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
      //Status if qoue
    let sql=`CREATE TABLE IF NOT EXISTS Quote1(
      qouteId VARCHAR(30) NOT NULL,
      firstName VARCHAR(30) NOT NULL,
      email VARCHAR(30),
      detail JSON DEFAULT NULL,
      pdfName VARCHAR(30) NOT NULL,
      acceptStatus VARCHAR(7) NOT NULL,
      PRIMARY KEY (qouteId),
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======Quote1 table availeble========");
    });
  }
})
