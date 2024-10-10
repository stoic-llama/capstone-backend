const Store = require('../models/store')
const mongoose = require('mongoose')
const store_item = require('../models/store_item')


const upsDowns = async (req, res) => 
{
    let _id = req.body._id
    let product_id = req.body.product_id
    let user_id = req.body.user_id
    let like = req.body.like            //like=1, unlike=0
    let dislike = req.body.dislike      //dislike=1, undislike=0

    if(like = 1) {
        console.log("I made it here")

        let store 
        try {
            console.log(req.body._id)

            store = await Store.findById(new mongoose.Types.ObjectId(_id))
            console.log(store)
            if (store === null) {
                return res.status(404).json({message: 'Cannot find store'})
            }
            else {

            console.log(product_id)

            store.updateOne(
                    {
                        'Store_items.product_id':product_id,
                    },
                    {
                        $push:{
                            'Store_items.$.Likes':user_id
                        }
                    })

                return res.status(200).json({ store:store })
            }
        } catch(err) {
            return res.status(500).json({ message: err.message })
        }
    
    }
}


module.exports = {
    upsDowns
};