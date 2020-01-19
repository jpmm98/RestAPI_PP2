const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Coord = require('../models/Coordenadas')

router.get('/', (req, res, next) => {
    Coord.find()
    .select('user_id latitude longitude')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            users :docs.map(doc =>{
                return {
                    _id: doc._id,
                    latitude: doc.latitude,
                    longitude: doc.longitude,
                    request:{
                        type: 'GET',
                        url_to_user: 'http://localhost:3000/coord/'+doc._id
                    }
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
    const coord = new Coord({
        user_id: req.body.user_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
            })

            coord
            .save()
            .then(result =>{
                console.log(result);
                res.status(200).json({
                    ok:true,
                   user_id: result.user_id,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    
                    
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
    


module.exports = router;

