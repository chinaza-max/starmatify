let getConnection = require('../mySql');


//rank  if the person chatting is an admin client project suppervisor staff

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{

    let sql=`CREATE TABLE IF NOT EXISTS projectReport1(
      projectReportId VARCHAR(50) NOT NULL,
      projectId VARCHAR(50) NOT NULL,
      message VARCHAR(200) NOT NULL,
      fileName VARCHAR(50) DEFAULT NULL,
      rank VARCHAR(50) DEFAULT NULL,
      name VARCHAR(30) NOT NULL,
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (projectReportId),
      FOREIGN KEY (projectId) REFERENCES Employee (projectId) ON DELETE CASCADE  
    )`
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.release();
      console.log("=======projectReport1 table availeble========");
    });
  }
})
