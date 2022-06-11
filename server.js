'use strict';

require("dotenv").config();

const http = require('http');
const express = require('express');
const cors = require("cors");
//const mongoSanitize = require('express-mongo-sanitize');
let cookieParser = require('cookie-parser');


const app = express();
const server = http.createServer(app)
const port=process.env.PORT||5000;
const passportContol=require("./Passport/index")



app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
/*
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
*/

app.use(passportContol.initialize());


// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);


const router1=require('./Router/Account')
const router2=require('./Router/Post')
const router3=require('./Router/Request')

app.use("/",router1);
app.use("/",router2);
app.use("/",router3);

server.listen(port ,()=>console.log(`server started.... ${port}`))