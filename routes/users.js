// setup for middleware for users endpoint/route
const express = require('express')
const router = express.Router()
const User = require('../models/user')

// Getting all
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Getting One
router.get('/:id', getUser, (req, res) => {
    res.json(res.user) // getUser already findById() from req.params.id
})

// Creating one
router.post('/', async (req, res) => {
    const user = new User({
        "Email": req.body.Email,
        "First_name": req.body.First_name,
        "Last_name": req.body.Last_name,
        "Password": req.body.Password,
    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

// Updating one
// using patch and not put, because put updates all columns
// while patch only updates the one column that has changed
router.patch('/:id', getUser, async (req, res) => {
    if( req.body.Email !== null) {
        res.user.Email = req.body.Email
    }
    if( req.body.First_name !== null) {
        res.user.First_name = req.body.First_name
    }
    if( req.body.Last_name !== null) {
        res.user.Last_name = req.body.Last_name
    }
    if( req.body.Password !== null) {
        res.user.Password = req.body.Password
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

// Deleting one
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne({id: req.params.id})
        res.json({ message: 'Deleted user'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// router middleware to get user by id
async function getUser(req, res, next) {
    let user 
    try {
        user = await User.findById(req.params.id)
        if (user === null) {
            return res.status(404).json({message: 'Cannot find user'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user 
    next()
}



module.exports = router 