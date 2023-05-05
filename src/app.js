const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes/index.js');
const {paymentRouter} = require('./payment/routes/payment.routes');
require('./db.js');

const server = express();

// server.use(express.json())
// server.use(express.urlencoded({ extended: true }))



const {CORS_API} = process.env;

server.name = 'API'; 

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});




server.use('/', routes);
server.use("/api",paymentRouter)

server.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/payment/public/index.html"));
})


// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
