let getConnection = require('../mySql');



getConnection((err,con)=>{
  //con.query(`USE starmate2`);
  let sql=`CREATE TABLE IF NOT EXISTS userTable1(
      id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(30) NOT NULL,
      lastName VARCHAR(30) NOT NULL,
      password VARCHAR(30) NOT NULL,
      email VARCHAR(50),
      address VARCHAR(30) NOT NULL,
      tel bigint(12) NOT NULL,
      gender VARCHAR(30) NOT NULL,
      active VARCHAR(30) NOT NULL,
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======User table created========");
    });
})

