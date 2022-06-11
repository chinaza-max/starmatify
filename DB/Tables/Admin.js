let con = require('../mySql');


con.query(`USE mydb4`);
let sql=`CREATE TABLE IF NOT EXISTS userTable1(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    message VARCHAR(30) NOT NULL,
    room VARCHAR(30) NOT NULL,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("user table created");
  });
