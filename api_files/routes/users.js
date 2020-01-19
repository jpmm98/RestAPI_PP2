const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth')

const User = require('../models/users');


/////GET all user on database/////

router.get('/', (req, res, next) => {
   User.find()
   .select('email password _id')
   .exec()
   .then(docs =>{
       const response = {
           count: docs.length,
           users :docs.map(doc =>{
               return {
                   email: doc.email,
                   password: doc.password,
                   _id: doc._id,
                   request:{
                       type: 'GET',
                       url_to_user: 'http://localhost:3000/users/'+doc._id
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

///////////////////////////
////////SIGNUP/////////////
///////////////////////////



router.post('/signup', (req, res, next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
                ok:false,
                message: 'e-Mail already exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{

                if(req.body.checkAdmin == 'admintrue' ){
                    
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        admin: true
                            })
                
                            user
                            .save()
                            .then(result =>{
                                console.log(result);
                                res.status(200).json({
                                    ok:true,
                                    message: 'User created successfully',
                                    createdUser: {
                                        admin: result.admin,
                                        email: result.email,
                                        _id: result._id,
                                        request: {
                                            type: 'GET',
                                            url_to_user: 'http://localhost:3000/users/'+result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    ok:false,
                                    error: err
                                })
                            });
                    

                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        admin: false
                            })
                
                            user
                            .save()
                            .then(result =>{
                                console.log(result);
                                res.status(200).json({
                                    ok:true,
                                    message: 'User created successfully',
                                    createdUser: {
                                        admin: result.admin,
                                        email: result.email,
                                        _id: result._id,
                                        request: {
                                            type: 'GET',
                                            url_to_user: 'http://localhost:3000/users/'+result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    ok:false,
                                    error: err
                                })
                            });
                    


                }


            
                }
            });
        
        }
    })
    .catch();

});

///////////////////////////
////////LOGIN/////////////
///////////////////////////

router.post('/login',(req, res, next)=>{
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                ok: false,
                message: 'Authorization failed email not found'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    ok: false,
                    message: ' Authorization failed '
                })
            }
            if (result){
                const token = jwt.sign({
                            email: user[0].email,
                            userID: user[0]._id
                        }, 
                    process.env.JWT_KEY,
                        {
                        expiresIn: "1h"
                        },

                );
                return res.status(200).json({
                    ok:true,
                    message: ' Authorization successful',
                    createdUser:{
                        _id: user[0]._id
                        
                    },
                    token: token
                })
            }
            return res.status(401).json({
                ok: false,
                message: ' Authorization failed password'
            })

        })
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err})
        });
})

/////GET user by ID////

router.get('/:userID',(req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
    .select('email password _id')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc){
            res.status(200).json({
                
                FetchedUser: {
                    User: doc,
                    request: {
                        type: 'GET',
                        description:'Fetch a designated user by ID',
                        url_to_user: 'http://localhost:3000/users/'+doc._id

                        }
                }
             
            });
            

        }else{
            res.status(404).json({message: 'No valid entry found for that id'})
        }
        
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err})
        });
})


////Update user info////
//Create array file with "propName": "email/password/etc...", "value": "to what you want to change"//

router.patch('/:userID', (req, res, next) => {
    const id = req.params.userID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, { $set: updateOps})
    .select("email password _id")
    .exec()
    .then( result =>{
        console.log(result);
        res.status(200).json({
            ok: true,
            Patch: {
                message: 'Updated User!',
                request:{
                    type:'PATCH',
                    url_to_user: 'http://localhost:3000/users/'+id

                }
            }
        })
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({ error : err })
    })
});

//////Delete a user by its ID////////

router.delete('/:userID', (req, res, next) => {
    const id = req.params.userID;
    
    User.findById(id)
    .exec()
    .then(foundID =>{
        if(foundID){
            User.deleteOne({   _id:id    })
            .exec()
            .then(result =>{
                res.status(200).json({
                    message: 'User deleted!',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/users',
                        body: {email: 'String', password: 'String'}
        
                    }
                });
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json({
                    error: err
                })
            });


        }else{
           
            res.status(404).json({
                message:'User doesnt exist'

            
        
            })
        }
     

        }).catch()


   
});


module.exports = router;