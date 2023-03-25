require('dotenv').config()

const express = require('express')
const session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(session) // pass in session variable
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


/////////////////
//   Session   //
/////////////////

const sessionStore = new MongoDbSession({
    uri: process.env.DATABASE_URL,
    collection: 'sessions',
}) 

// create req.session object
// req.session object will have state that is persistent in all req <> res cycles
app.use(session({
    secret: 'key that will sign cookie',
    resave: false, // for every request to server, create new session regardless same browser or user
    saveUninitialized: false, // if not touched or modified session, don't save session
    store: sessionStore,
}))

app.get("/", (req, res) => {
    req.session.isAuth = true
    console.log(req.session.id)
    res.send("Hello Session")
})



////////////////
//   Routes   //
////////////////

// Remove CORS between :3700 and :4100 difference
// Refer https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", process.env.CORS_FRONTEND_URL);
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

// setup users endpoint/route
const usersRouter = require('./routes/users')
app.use('/users', usersRouter)


/////////////////
//   Startup   //
/////////////////
const port = process.env.PORT || 4101

// start server at port 4100
app.listen(port, () => console.log(`Server started at ${port}`))