let getConnection = require('../mySql');

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{

    let sql=`CREATE TABLE IF NOT EXISTS projectLog(
        projectLogId VARCHAR(50) NOT NULL,
        projectId VARCHAR(50) NOT NULL,
        clockIn VARCHAR(5) NOT NULL,
        clockOut VARCHAR(5) DEFAULT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (projectReportId),
        FOREIGN KEY (projectId) REFERENCES Employee (projectId) ON DELETE CASCADE  
      )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======projectLog table availeble========");
    });
  }
})
