let con = require('../mySql');


con.query(`USE mydb4`);
let sql=`CREATE TABLE IF NOT EXISTS staff1(
    staffId VARCHAR(30) NOT NULL,
    firstName VARCHAR(15) NOT NULL,
    lastName VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50),
    address VARCHAR(30) NOT NULL,
    tel bigint(12) NOT NULL,
    gender VARCHAR(7) NOT NULL,
    available VARCHAR(5) NOT NULL,
    avatar VARCHAR(30) NOT NULL,
    PRIMARY KEY (staffId),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("staff1 table created");
  });
