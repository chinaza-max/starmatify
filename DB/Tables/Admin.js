const getConnection = require('../mySql');
const { v4: uuid } = require('uuid')
const id=uuid();



let reg = {
  userName:process.env.APP_ADMIN_USERNAME,
  password:process.env.APP_ADMIN_PASSWORD,
  AdminType:true,
  adminID:id
};

getConnection((err,con)=>{
  if(err){
    console.log(err)
  }
  else{
    let sql=`CREATE TABLE IF NOT EXISTS Admin2(
      id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      userName VARCHAR(30) NOT NULL,
      password VARCHAR(50),
      adminType VARCHAR(30) NOT NULL,
      adminID  VARCHAR(30) NOT NULL,
      reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
    
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      
      con.query("SELECT * FROM Admin2 WHERE userName = ?",[process.env.APP_ADMIN_USERNAME],
        function (err, rows) {
          if (err) {
              con.release();
              return console.log(err);
          }
          else{
            if (!rows.length) {
                con.query("INSERT INTO Admin2 SET ?",reg,function (err, results) {
                  if (err) {
                    con.release();
                    return console.log( "data base error");
                  } 
                  else {
                    console.log('inserted')
                    con.release();
                  }
                })
            } 
            else {
            console.log("already exist")           
            }
          }
        }
      )
      console.log("=======Admin table availeble========");
    });
  }
})

