const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: "New Room"
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            user: {
                type: String,
                required: true,
                ref: "User"
            },
            content: {
                type: String,
                required: false,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            file: {
                data: Buffer, 
                filename: String,
                required:false,
                contentType: String,
            },
        },
    ],
    timestamp: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('Room', roomSchema);