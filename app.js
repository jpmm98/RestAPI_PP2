const express = require('express');
const app = express();
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./api_files/routes/users');
const chatRoutes = require('./api_files/routes/chat')
const coordRoutes = require('./api_files/routes/coordenadas')

mongoose.connect(
'mongodb+srv://AdminAdmin:'+
 process.env.MONGO_ATLAS_PW +
 '@node-myapi-sdkvb.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser : true
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));   //extract urlencoded data
app.use(bodyParser.json());                         //extract json data

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/users', usersRoutes);
app.use('/chat', chatRoutes);
app.use('/coord', coordRoutes);
//app.use('/products', productroutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status= 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
})
module.exports = app;