// setup for middleware for stores endpoint/route
const express = require('express')
const router = express.Router()
const Store = require('../models/store')
const axios = require('axios');

/***************************************************/      
/* Updating store/product combination availability */
/***************************************************/

router.post('/:id', getStore, async (req, res) => {
    /*
        Shape of Request:
        - store _id
        - product _id
        - likes true/false  // did user select like?
        - dislikes true/false // did user select dislike?
        - email xxx@xxx.com

        Rules of Likes Arr, Dislikes Arr, Total_likes, Total_dislikes:
        1) "Likes selected, User not in Likes Arr"	=> "Add to Likes Arr, Increment Total_like"
        2) "Likes deselected, User in Likes Arr" => Do nothing
        3) "Dislikes selected, User not in Dislikes Arr" => "Add to Dislikes Arr, Increment Total_dislikes"
        4) "Dislikes deselected, User in Dislikes Arr"	=> Do nothing
        5) Each scenario is independent of the other. 
    */

    res.stores.Store_items.forEach( item => {
        // find the corresponding product in store/product object in database
        if(req.body.product_id === item._id) {
    
            let userInLikesArr = null
            userInLikesArr = item.Likes.find(u => u.email === req.body.email)
            
            let userInDislikesArr = null
            userInDislikesArr = item.Dislikes.find(u => u.email === req.body.email)
             
            // 1) "Likes selected, User not in Likes Arr" => "Add to Likes Arr, Increment Total_like"
            if(req.body.likes === true && userInLikesArr === null) {
                let url = process.env.API_AUTH_URL + '/user/lookup'
                let user = axios.post(url, {
                    email: req.body.email
                })

                item.Likes.push(user)
                item.Total_likes = item.Total_likes + 1
            }

            // 2) "Likes not selected, User in Likes Arr" => "Remove from Likes Arr, Decrement Total_likes" 
            if(req.body.likes === false && userInLikesArr !== null) {
                let elementPos = item.Likes.findIndex(u => u.email === req.body.email);
                item.Likes.splice(elementPos, 1); // this wil remove the element 
            }

            // 3) "Dislikes selected, User not in Dislikes Arr" => "Add to Dislikes Arr, Increment Total_dislikes"
            if(req.body.dislikes === true && userInDislikesArr === null) {
                let url = process.env.API_AUTH_URL + '/user/lookup'
                let user = axios.post(url, {
                    email: req.body.email
                })

                item.Dislikes.push(user)
                item.Total_dislikes = item.Total_dislikes + 1
            }

            // 4) "Dislikes not selected, User in Dislikes Arr" => Do nothing
            if(req.body.dislikes === false && userInDislikesArr !== null) {
                let elementPos = item.Dislikes.findIndex(u => u.email === req.body.email);
                item.Dislikes.splice(elementPos, 1); // this wil remove the element 
            }
        }
    })

    try {
        const updatedStore = await res.store.save()
        res.json(updatedStore)
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})





/****************************************/      
/* Router middleware to get store by id */
/****************************************/

async function getStore(req, res, next) {
    let store 
    try {
        store = await Store.findById(req.params.id)
        if (store === null) {
            return res.status(404).json({message: 'Cannot find store'})
        }
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }

    res.store = store 
    next()
}



module.exports = router 