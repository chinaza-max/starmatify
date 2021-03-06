let getConnection = require('../mySql');

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{

    let sql=`CREATE TABLE IF NOT EXISTS Job1(
        jobId VARCHAR(30) NOT NULL,
        projectId VARCHAR(30) NOT NULL,
        projectName VARCHAR(15) NOT NULL,
        duration VARCHAR(10) DEFAULT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (projectReportId),
        FOREIGN KEY (projectId) REFERENCES Employee (projectId) ON DELETE CASCADE  
      )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======Job1 table availeble========");
    });
  }
})
