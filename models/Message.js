// models for contact messages
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    }, { timestamps: true } );


    module.exports = mongoose.model('Message', messageSchema);