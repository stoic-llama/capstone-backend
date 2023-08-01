// healthcheck for overall application - is the app up or not?
// this is not api-specfic, but overall app
// https://blog.logrocket.com/how-to-implement-a-health-check-in-node-js/

const express = require('express')
const router = express.Router()

router.get('/', async (_req, res, _next) => {
    const healthcheck = {
        name: 'capstone-backend',
        message: 'OK',
        uptime: Math.floor(process.uptime()) + " seconds",
        timestamp: new Date(Date.now()).toString() 
    };
    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        res.status(500).json({
            name: 'capstone-backend',
            message: error.message,
            uptime: Math.floor(process.uptime()) + " seconds",
            timestamp: new Date(Date.now()).toString() 
        });
    }
});

module.exports = router;