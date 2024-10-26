const Store = require('../models/store')
const mongoose = require('mongoose')
const store_item = require('../models/store_item')


const updateLikes = async (req, res) => 
{
    const { store_id, product_id, email, like, dislike } = req.body; 
    console.log('Received parameters:', { store_id, product_id, email, like, dislike });

    if ( (like == 1) && (dislike == 0) )
    {
        try {
            const store = await Store.findOneAndUpdate(
                { 
                    _id: new mongoose.Types.ObjectId(store_id), 
                    "Store_items._id": new mongoose.Types.ObjectId(product_id) 
                },
                {
                    $addToSet: { "Store_items.$.Likes": email }, // Add email to Likes
                    $inc: { "Store_items.$.Total_likes": 1} // Increment Total_likes
                },
                { new: true } // Return the updated document instead of the original before update
            );

            if (!store) {
                console.log('Store not found for:', { storeId: store_id, productId: product_id });
                return res.status(404).json({ message: 'Store or product not found' });
            }

            res.json(store);
        } catch (err) {
            console.error('Error in updateLikes:', err);
            res.status(500).json({ message: err.message });
        }
    }
    else if ( (like == 1) && (dislike == 1) ) {
        try {
            const store = await Store.findOneAndUpdate(
                { 
                    _id: new mongoose.Types.ObjectId(store_id), 
                    "Store_items._id": new mongoose.Types.ObjectId(product_id) 
                },
                {
                    $pull: {"Store_items.$.Dislikes": email },   // Remove user's email previous Dislike interaction 
                    $addToSet: { "Store_items.$.Likes": email }, // Add email to Likes
                    $inc: { "Store_items.$.Total_likes": 1, "Store_items.$.Total_dislikes": -1 } // Increment Total_likes and decrement Total_dislikes
                },
                //{ new: true } // Return the updated document instead of the original before update
            );
            return res.status(200).json({ update_status: 'SUCCESS' });


            if (!store) {
                console.log('Store not found for:', { storeId: store_id, productId: product_id });
                return res.status(404).json({ message: 'Store or product not found' });
            }

            res.json(store);
        } catch (err) {
            console.error('Error in updateLikes:', err);
            res.status(500).json({ message: err.message });
        }
    }
    else {
        console.error('Bad Request - Invalid Arguments');
            res.status(422).json({ message: 'Bad Request - Invalid Arguments' });
    }
};

module.exports = {
    updateLikes
};