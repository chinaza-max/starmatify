/*

1.============create connection=========
2. ==============create database========

*/
const mysql = require('mysql');

const dataBaseName="starmate2"
//this section below create connection and data base
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});
con.connect(function(err) {  
  if (err) throw err;
  con.query(`CREATE DATABASE IF NOT EXISTS ${dataBaseName}`,(err,result)=>{
      if (err)  throw err;
    
      console.log(`====${dataBaseName} dataBase available====`)
  })
})


//this section below create a pool  connection with already created dataBase
const pool = mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "",
    database:dataBaseName
  });

const getConnection=function(callBack){
    pool.getConnection(function(err, connection) {
      if(err){
        if(err.code=="PROTOCOL_CONNECTION_LOST"){
          console.log("dataBase connection was close")
        }
        if(err.code=="ER_CON_COUNT_ERROR"){
          console.log("dataBase has too many connection")
        }
        if(err.code=="ECONNREFUSED"){
          console.log("dataBase connection was refuse")
        }
      }
      return  callBack(err, connection)
    })
  }
 

module.exports=getConnection;
require("./Tables/User")

//https://riptutorial.com/node-js/example/29792/export-connection-pool