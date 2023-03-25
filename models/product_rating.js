const mongoose = require('mongoose')

const productRatingsSchema = new mongoose.Schema({    
    "Product_id": {
        type: String,
        required: true,        
    },
    "Product_family": {
        type: String,
        required: true,   
    },
    "Product": {
        type: String,
        required: true,   
    },
    "Price": {
        type: Number,
        required: true,   
    },
    "Availability": {
        type: String,
        required: true,   
    },
    "Quantity": {
        type: Number,
        required: false,   
    },
    "Product_url": {
        type: String,
        required: true,   
    },
    "Product_img_url": {
        type: String,
        required: true,   
    }, 
    "Total_likes": {
        type: Number,
        required: true,   
    },
    "Total_dislikes": {
        type: Number,
        required: true,   
    },
    "Likes": {
        type: Array, // User objects
        required: true, 
    },
    "Dislikes": {
        type: Array, // User objects
        required: true, 
    },
})

// .model() function allows us to directly interact with database schema
module.exports = mongoose.model('Product_rating', productRatingsSchema)