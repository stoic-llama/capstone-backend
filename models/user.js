const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    "Email": {
        type: String,
        required: true,
    },
    "First_name": {
        type: String,
        required: true,
    },
    "Last_name": {
        type: String,
        required: false, // some cultures only have one name
    },
    "Password": {
        type: String,
        required: true, 
    },
    "Permissions": {
        type: Array,
        required: true, 
    },
    // "Likes": {
    //     type: Array,
    //     required: true, 
    // },
    // "Dislikes": {
    //     type: Array,
    //     required: true, 
    // },
})

// .model() function allows us to directly interact with database schema
module.exports = mongoose.model('User', usersSchema)