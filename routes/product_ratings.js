// setup for middleware for product_rating endpoint/route
const express = require('express')
const router = express.Router()
const Product_rating = require('../models/product_rating')

// Getting all
router.get('/', async (req, res) => {
    try {
        const product_ratings = await Product_rating.find()
        res.json(product_ratings)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Getting One
router.get('/:id', getProduct_rating, (req, res) => {
    res.json(res.product_rating) // getProduct_rating already findById() from req.params.id
})

// Creating one
router.post('/', async (req, res) => {
    const product_rating = new Product_rating({
        "Product_id": req.body.Product_id,
        "Product_family": req.body.Product_family,
        "Product": req.body.Product,
        "Price": req.body.Price,
        "Availability": req.body.Availability,
        "Quantity": req.body.Quantity,
        "Product_url": req.body.Product_url,
        "Product_img_url": req.body.Product_img_url, 
    })

    try {
        const newProduct_rating = await product_rating.save()
        res.status(201).json(newProduct_rating)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

// Updating one
// using patch and not put, because put updates all columns
// while patch only updates the one column that has changed
router.patch('/:id', getProduct_rating, async (req, res) => {
    if( req.body.Product_id !== null) {
        res.product_rating.Product_id = req.body.Product_id
    }
    if( req.body.Product_family !== null) {
        res.product_rating.Product_family = req.body.Product_family
    }
    if( req.body.Product !== null) {
        res.product_rating.Product = req.body.Product
    }
    if( req.body.Price !== null) {
        res.product_rating.Price = req.body.Price
    }
    if( req.body.Availability !== null) {
        res.product_rating.Availability = req.body.Availability
    }
    if( req.body.Quantity !== null) {
        res.product_rating.Quantity = req.body.Quantity
    }
    if( req.body.Product_url !== null) {
        res.product_rating.Product_url = req.body.Product_url
    }
    if( req.body.Product_img_url !== null) {
        res.product_rating.Product_img_url = req.body.Product_img_url
    }

    try {
        const updatedProduct_rating = await res.product_rating.save()
        res.json(updatedProduct_rating)
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

// Deleting one
router.delete('/:id', getProduct_rating, async (req, res) => {
    try {
        await res.product_rating.deleteOne({id: req.params.id})
        res.json({ message: 'Deleted product_rating'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// router middleware to get product_rating by id
async function getProduct_rating(req, res, next) {
    let product_rating 
    try {
        product_rating = await Product_rating.findById(req.params.id)
        if (product_rating === null) {
            return res.status(404).json({message: 'Cannot find product_rating'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }

    res.product_rating = product_rating 
    next()
}



module.exports = router 