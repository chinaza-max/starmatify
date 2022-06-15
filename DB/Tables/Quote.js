let getConnection = require('../mySql');
  

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
      
      let sql=`CREATE TABLE IF NOT EXISTS Quote1(
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(50),
        tel VARCHAR(30) NOT NULL,
        details VARCHAR(30) NOT NULL,
        status VARCHAR(30) NOT NULL,
        accountStatus VARCHAR(30) NOT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`;
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======Quote1 table availeble========");
    });
  }
})
