const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({

    sender:{
        type: String,
        required: true,
    }, 
    receiver:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: false,
    },
    file: {
        data: Buffer,
        filename: String,
        required:false,
        contentType: String,
    },
    timestamp:{
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('Message', MessageSchema);