require('dotenv').config()

const app = require('./app.js')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 9999;


/////////////////
//   Startup   //
/////////////////

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });