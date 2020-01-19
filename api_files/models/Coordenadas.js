const mongoose = require('mongoose');

const coordSchema = mongoose.Schema({
    user_id:{
        type: String,
        required: true, 
    },
    latitude: {
        type: Number,
        required: true, 
    },
    longitude:  {
        type: Number,
        required: true, 
    },
    
})

module.exports= mongoose.model('Coordenadas', coordSchema)