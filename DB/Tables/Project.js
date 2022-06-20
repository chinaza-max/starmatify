let getConnection = require('../mySql');

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{

    let sql=`CREATE TABLE IF NOT EXISTS project1(
      detail JSON DEFAULT NULL,
      staffDtails JSON DEFAULT NULL,
      staffSupervisor VARCHAR(30) NOT NULL,
      projectSupervisor JSON DEFAULT NULL,
      amount bigint(12) NOT NULL,
      amountPaid bigint(12) NOT NULL,
      projectStatus VARCHAR(30) NOT NULL,
      userId VARCHAR(30) NOT NULL,
      projectId VARCHAR(30) NOT NULL,
      PRIMARY KEY (projectId),
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======project1 table availeble========");
    });
  }
})
