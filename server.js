require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//////////////////
//   Database   //
//////////////////

// setup database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection 
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.get("/", (req, res) => {
    res.send("API is alive!")
})

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

// setup products endpoint/route
const product_ratingsRouter = require('./routes/product_ratings')
app.use('/product_ratings', product_ratingsRouter)

// setup stores endpoint/route
const storesRouter = require('./routes/stores')
app.use('/stores', storesRouter)

// setup availability endpoint/route
const availabilityRouter = require('./routes/availability')
app.use('/availability', availabilityRouter)

// setup healthcheck for entire application
const healthcheckRouter = require('./routes/healthcheck')
app.use('/healthcheck', healthcheckRouter);

// setup users endpoint/route
// const usersRouter = require('./routes/users')
// app.use('/users', usersRouter)


/////////////////
//   Startup   //
/////////////////
const port = process.env.PORT || 9999

// start server at port 4100
app.listen(port, () => console.log(`Server started at ${port}`))

// Introduce an error to exit unexpectedly for the demo
throw new Error('Unexpected error occurred.');