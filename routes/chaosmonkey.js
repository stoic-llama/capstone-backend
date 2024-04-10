// healthcheck for overall application - is the app up or not?
// this is not api-specfic, but overall app
// https://blog.logrocket.com/how-to-implement-a-health-check-in-node-js/

const express = require('express')
const router = express.Router()

router.post('/', async (req, res, _next) => {
    console.log("req.body.activate = " + req.body.activate)

    if(req.body.activate == false) { // for testing purposes
        try {
            res.status(200).json({
                name: 'capstone-backend',
                message: 'Chaos Monkey API is available. 🐒 is waiting...',
                timestamp: formattedDateNow() // new Date(Date.now()).toString() 
            })
        } catch (error) {
            res.status(500).json({
                name: 'capstone-backend',
                message: 'Oops the Chaos Monkey API is down: ' + error.message,
                timestamp: formattedDateNow() // new Date(Date.now()).toString() 
            });
        }
    } else { // activate chaos!
        try {
            const healthcheck = {
                name: 'capstone-backend',
                message: 'Chaos starting... 🍌🍌🍌',
                timestamp: formattedDateNow() // new Date(Date.now()).toString() 
            };

            res.status(200).json(healthcheck);
        } catch (error) {
            res.status(500).json({
                name: 'capstone-backend',
                message: 'Oops the monkey got caught, back to work: ' + error.message,
                timestamp: formattedDateNow() // new Date(Date.now()).toString() 
            });
        }

        startChaos()
    }
})

function startChaos() {
    // Introduce an error to exit unexpectedly for the demo
    throw new Error('🍌🍌🍌 Unexpected error occurred 🍌🍌🍌.');
}

function formattedDateNow() {
    var result = "" 
    var d = new Date(Date.now())
 
    // format ---> 'YYYY/MM/D hh:mm:ss SSS'
 
    result = result + d.getFullYear()
             + "-"
             + String(d.getMonth() + 1).padStart(2, '0') // (d.getMonth()+1)
             + "-"
             + d.getDate().toString().padStart(2,0) 
             + " "
             + d.getHours().toString().padStart(2,0)
             + ":"
             + d.getMinutes().toString().padStart(2,0)
             + ":"
             + d.getSeconds().toString().padStart(2,0)
             // + "."
             // + d.getMilliseconds().toString().padStart(2,0)
 
    return result;
 }

module.exports = router;