const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    user_id:{
        type: String,
        required: true, 
    },
    chat_text: {
        type: String,
        required: true, 
    },
    admin:  {
        type: String,
        required: false, 
    },
    
})

module.exports= mongoose.model('Chat', chatSchema)