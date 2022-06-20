let getConnection = require('../mySql');



getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
      //con.query(`USE starmate2`);
    let sql=`CREATE TABLE IF NOT EXISTS userTable2(
      userId VARCHAR(30) NOT NULL,
      firstName VARCHAR(15) NOT NULL,
      lastName VARCHAR(15) NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(50),
      address VARCHAR(30) NOT NULL,
      tel bigint(12) NOT NULL,
      gender VARCHAR(8) NOT NULL,
      active VARCHAR(6) NOT NULL,
      avatar VARCHAR(30) NOT NULL,
      PRIMARY KEY (userId),
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======userTable2 table availeble========");
    });
  }
})
