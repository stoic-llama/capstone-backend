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

    console.log("In the main availability api")

    res.store.Store_items.forEach( async function(item) {
        // find the corresponding product in store/product object in database
        if(req.body.product_id === item._id.toString()) {

                let userInLikesArr = undefined
                userInLikesArr = item.Likes.find(u => u.email === req.body.email)     
                let userInDislikesArr = undefined
                userInDislikesArr = item.Dislikes.find(u => u.email === req.body.email)
                 
                console.log("userInLikesArr: " + userInLikesArr)
                console.log("userInDislikesArr: " + userInDislikesArr)
    
                // // 1) "Likes selected, User not in Likes Arr" => "Add to Likes Arr, Increment Total_like"
                if(req.body.likes === true && userInLikesArr === undefined) {
                    console.log("got to condition #1!")
                    let url = process.env.API_AUTH_URL + '/user/lookup'
       
                    let user = axios.post(url, {
                        email: req.body.email
                    })

                    item.Likes.forEach( u => console.log("here's before Likes: " + u.email))
                    item.Likes.push(user)

                    // let query = {}
                    // let document = {$push: user}
                    // res.store.updateOne(
                    //     {"_id" : ObjectId(req.params.id)}, 
                    //     {$set: {
                    //         'Store_items.$[Store_items].Likes
                    //     }}
                    // )

                    console.log("typeof: " + typeof(item.Likes[0]))
                    item.Likes.forEach( u => console.log("here's after Likes: " + u.email))

                    item.Total_likes = item.Total_likes + 1
                }
    
                // // 2) "Likes not selected, User in Likes Arr" => "Remove from Likes Arr, Decrement Total_likes" 
                // if(req.body.likes === false && userInLikesArr !== undefined) {
                //     let elementPos = item.Likes.findIndex(u => u.email === req.body.email);
                //     item.Likes.splice(elementPos, 1); // this wil remove the element 
    
                //     // try {
                //     //     res.json({
                //     //         message: `${req.body.email} feedback for availability has been updated successfully`,
                //     //         uptime: Math.floor(process.uptime()) + " seconds",
                //     //         timestamp: new Date(Date.now()).toString() 
                //     //     })                    
                //     // } catch (err) {
                //     //     res.json({
                //     //         message: err.message,
                //     //         uptime: Math.floor(process.uptime()) + " seconds",
                //     //         timestamp: new Date(Date.now()).toString() 
                //     //     })
                //     // }
                // }
    
                // // 3) "Dislikes selected, User not in Dislikes Arr" => "Add to Dislikes Arr, Increment Total_dislikes"
                // if(req.body.dislikes === true && userInDislikesArr === undefined) {
                //     let url = process.env.API_AUTH_URL + '/user/lookup'
                //     try {
                //         let user = axios.post(url, {
                //             email: req.body.email
                //         })
        
                //         item.Dislikes.push(user)
                //         item.Total_dislikes = item.Total_dislikes + 1
    
                //         // res.json({
                //         //     message: `${user.email} feedback for availability has been updated successfully`,
                //         //     uptime: Math.floor(process.uptime()) + " seconds",
                //         //     timestamp: new Date(Date.now()).toString() 
                //         // })                    
                //     } catch (err) {
                //         res.json({
                //             message: err.message,
                //             uptime: Math.floor(process.uptime()) + " seconds",
                //             timestamp: new Date(Date.now()).toString() 
                //         })
                //     }
                // }
    
                // // 4) "Dislikes not selected, User in Dislikes Arr" => Do nothing
                // if(req.body.dislikes === false && userInDislikesArr !== undefined) {
                //     let elementPos = item.Dislikes.findIndex(u => u.email === req.body.email);
                //     item.Dislikes.splice(elementPos, 1); // this wil remove the element
                 
                //     // try {
                //     //     res.json({
                //     //         message: `${req.body.email} feedback for availability has been updated successfully`,
                //     //         uptime: Math.floor(process.uptime()) + " seconds",
                //     //         timestamp: new Date(Date.now()).toString() 
                //     //     })                    
                //     // } catch (err) {
                //     //     res.json({
                //     //         message: err.message,
                //     //         uptime: Math.floor(process.uptime()) + " seconds",
                //     //         timestamp: new Date(Date.now()).toString() 
                //     //     })
                //     // }
                // }
        }
    })

    try {
        const updatedStore = await res.store.save()

        res.status(200).json({
            message: "store product availability updated successfully",
            uptime: Math.floor(process.uptime()) + " seconds",
            timestamp: new Date(Date.now()).toString(), 
            updatedStore: updatedStore,
        }) 
    }
    catch (err) {
        res.status(500).json({ message: err.message })
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

    console.log("In getStores")

    next()
}



module.exports = router 