/*
    Separate app object so jest won't fail with error:
      ●  Cannot log after tests are done. Did you forget to wait for something async in your test?

    Based on online comments, when you export app, it exports app.listen(), 
    so after jest is done it is still listening hence the error
    Source: https://stackoverflow.com/a/72969047
*/

require('dotenv').config()

const express = require("express");
const cors = require('cors');
const router = require('./routes/route'); 
const app = express()
const apiVersion = '/api/v' + process.env.API_VERSION

////////////////
//   Routes   //
////////////////

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get("/", (req, res) => {
    res.send("API is alive!")
})

app.use(apiVersion, router);
  
module.exports = app