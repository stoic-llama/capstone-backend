const Store = require('../models/store')


// Getting all
const storesWrapper = async (req, res) => {
    // // Introduce an error to exit unexpectedly for the demo
    // throw new Error('🍌🍌🍌 Unexpected error occurred 🍌🍌🍌.');

    try {
        const stores = await Store.find()
        res.json(stores)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
}

// Getting One
// router.get('/:id', getStore, (req, res) => {
//     res.json(res.store) // getStore already findById() from req.params.id
// })

// Creating one
// router.post('/', async (req, res) => {
//     const store = new Store({
//         "Company": req.body.Company,
//         "Zip_code": req.body.Zip_code,
//         "Address_line1": req.body.Address_line1,
//         "Address_line2": req.body.Address_line2,
//         "City": req.body.City,
//         "State": req.body.State,
//         "Country": req.body.Country,
//         "Longitude": req.body.Longitude,
//         "Latitude": req.body.Latitude,
//         "Store_name": req.body.Store_name,
//         "Store_id": req.body.Store_id,
//         "Store_items": req.body.Store_items,
//     })

//     try {
//         const newStore = await store.save()
//         res.status(201).json(newStore)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }

// })

// // Updating one
// // using patch and not put, because put updates all columns
// // while patch only updates the one column that has changed
// router.patch('/:id', getStore, async (req, res) => {
//     /*
//         "Company": req.body.Company,
//         "Zip_code": req.body.Zip_code,
//         "Address_line1": req.body.Address_line1,
//         "Address_line2": req.body.Address_line2,
//         "City": req.body.City,
//         "State": req.body.State,
//         "Country": req.body.Country,
//         "Longitude": req.body.Longitude,
//         "Latitude": req.body.Latitude,
//         "Store_name": req.body.Store_name,
//         "Store_id": req.body.Store_id,
//         "Store_items": req.body.Store_items,
//     */
//     if( req.body.Company !== null) {
//         res.store.Company = req.body.Company
//     }
//     if( req.body.Zip_code !== null) {
//         res.store.Zip_code = req.body.Zip_code
//     }
//     if( req.body.Address_line1 !== null) {
//         res.store.Address_line1 = req.body.Address_line1
//     }
//     if( req.body.Address_line2 !== null) {
//         res.store.Address_line2 = req.body.Address_line2
//     }
//     if( req.body.City !== null) {
//         res.store.City = req.body.City
//     }
//     if( req.body.Company !== null) {
//         res.store.Company = req.body.Company
//     }
//     if( req.body.State !== null) {
//         res.store.State = req.body.State
//     }
//     if( req.body.Country !== null) {
//         res.store.Country = req.body.Country
//     }
//     if( req.body.Longitude !== null) {
//         res.store.Longitude = req.body.Longitude
//     }
//     if( req.body.Latitude !== null) {
//         res.store.Latitude = req.body.Latitude
//     }
//     if( req.body.Store_name !== null) {
//         res.store.Store_name = req.body.Store_name
//     }
//     if( req.body.Store_id !== null) {
//         res.store.Store_id = req.body.Store_id
//     }
//     // Note did not allow updates to the products / store items in the store in this end point

//     try {
//         const updatedStore = await res.store.save()
//         res.json(updatedStore)
//     } catch (err) {
//         res.status(400).send({message: err.message})
//     }
// })

// Deleting one
// router.delete('/:id', getStore, async (req, res) => {
//     try {
//         await res.store.deleteOne({id: req.params.id})
//         res.json({ message: 'Deleted store'})
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })


/****************************************/      
/* Router middleware to get store by id */
/****************************************/

// async function getStore(req, res, next) {
//     let store 
//     try {
//         store = await Store.findById(req.params.id)
//         if (store === null) {
//             return res.status(404).json({message: 'Cannot find store'})
//         }
//     } catch(err) {
//         return res.status(500).json({ message: err.message })
//     }

//     res.store = store 
//     next()
// }



// module.exports = router 

module.exports = {
    storesWrapper
};