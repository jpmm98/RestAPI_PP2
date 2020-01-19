const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Chat = require('../models/chat')



router.get('/', (req, res, next) => {
    Chat.find()
    .select('user_id chat_text')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            chat :docs.map(doc =>{
                return {
                    user_id: doc.user_id,
                    chat_text: doc.chat_text,
                
                }
            })
        }
        console.log(response);
        res.status(200).json(response);
        
     })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
 
 });

 router.get('/:userID', (req, res, next) => {
     const id = req.params.userID;
    Chat.find({user_id: id})
    .select('user_id chat_text')
    .exec()
    .then(docs =>{
        const response = {

            chat :docs.map(doc =>{
                return {
                    user_id: doc.user_id,
                    chat_text: doc.chat_text,
                
                }
            })
        }
        console.log(response);
        res.status(200).json(response);
        
     })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
 
 });

 


 router.post('/',(req, res, next)=>{
    const chat = new Chat({
        user_id: req.body.user_id,
        chat_text: req.body.chat_text,
            })

            chat
            .save()
            .then(result =>{
                console.log(result);
                res.status(200).json({
                    ok:true,
                    chat: result.chat_text,
                    message: 'Message sent',
                    
                    
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    ok:false,
                    error: err
                })
            });
    
        });
    



router.delete('/',(req,res,next) => {
    Chat.deleteMany({}, sol => {
        res.status(200).json({
            message: 'Deleted all'

        })
        console.log(err)
    })

})



module.exports = router;