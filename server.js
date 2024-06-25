require('dotenv').config()

// const express = require('express')
// const app = express()
const app = require('./app.js')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 9999;


// const main = async () => {
//   //////////////////
//   //   Database   //
//   //////////////////

//   // setup database connection
//   mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
//   const db = mongoose.connection 
//   db.on('error', async (error) => console.error(error))
//   db.once('open', async () => console.log('Connected to database'))


//   /////////////////
//   //   Startup   //
//   /////////////////
//   const port = process.env.PORT || 9999

//   // start server at port 5000
//   // app.listen(port, () => console.log(`Server started at ${port}`))
//   await app.listen(port)
//   await console.log(`Server started at ${port}`)
// };

// main();



/* Connecting to the database and then starting the server. */
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, console.log("Server started on port 5000"));
  })
  .catch((err) => {
    console.log(err);
  });