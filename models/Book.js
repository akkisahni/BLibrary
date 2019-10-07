const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    author: {
        type: String
    },
    ISBN:{
        type: Number,
        required: true,
    },
    genre:{
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    coverPic:{
        type: Buffer
    },
    inventoryStatus:{
        type: Number
    },
    rentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

const Books = mongoose.model('books', BookSchema); 
module.exports = Books;