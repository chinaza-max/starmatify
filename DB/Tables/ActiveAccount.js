let getConnection = require('../mySql');


  
getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
    let sql=`CREATE TABLE IF NOT EXISTS activateAccount(
      id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      hash VARCHAR(30) NOT NULL,
      userId VARCHAR(30) NOT NULL,
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("=======activateAccount table availeble=======");
    });
  }
})

