const mongoose = require('mongoose')

const store_itemSchema = new mongoose.Schema({
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
        required: false,
    },
    "Availability": {
        type: String,
        required: true,
    },
    "Quantity": {
        type: Number,
        required: true,
    },
    "Product_url": {
        type: String,
        required: true,
    },
    "Product_img_url": {
        type: String,
        required: true,
    },
    "Total_dislikes": {
        type: Number,
        required: true,
    },
    "Total_likes": {
        type: Number,
        required: true,
    },
    "Dislikes": {
        type: Array,
        required: true,
    },
    "Likes": {
        type: Array,
        required: true,
    },
})

// .model() function allows us to directly interact with database schema
module.exports = mongoose.model('Store_Item', store_itemSchema)