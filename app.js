/*
    Separate app object so jest won't fail with error:
      ●  Cannot log after tests are done. Did you forget to wait for something async in your test?

    Based on online comments, when you export app, it exports app.listen(), 
    so after jest is done it is still listening hence the error
    Source: https://stackoverflow.com/a/72969047
*/

require('dotenv').config()

const express = require("express");
const router = require('./routes/route'); 
const app = express()
const apiVersion = '/api/v' + process.env.API_VERSION

////////////////
//   Routes   //
////////////////

// Remove CORS between :3700 and :4100 difference
// Refer https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*"); // process.env.CORS_FRONTEND_URL);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
// setup app to process JSON
app.use(express.json())

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.get("/", (req, res) => {
    res.send("API is alive!")
})

app.use(apiVersion, router);
  
module.exports = app