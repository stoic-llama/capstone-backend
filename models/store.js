const mongoose = require('mongoose')

const storesSchema = new mongoose.Schema({
    "Company": {
        type: String,
        required: true,
    },
    "Zip_code": {
        type: String,
        required: true,        
    },
    "Address_line1": {
        type: String,
        required: true,
    },
    "Address_line2": {
        type: String,
        required: false,
    },
    "City": {
        type: String,
        required: true,
    },
    "State": {
        type: String,
        required: true,
    },
    "Country": {
        type: String,
        required: true,
    },
    "Longitude": {
        type: Number,
        required: true,
    },
    "Latitude": {
        type: Number,
        required: true,
    },
    "Store_name": {
        type: String,
        required: true,
    },
    "Store_id": {
        type: String,
        required: true,
    },
    "Store_items": {
        type: Array, // array of Product_ratings objects
        required: true,
    },
})

// .model() function allows us to directly interact with database schema
module.exports = mongoose.model('Store', storesSchema)