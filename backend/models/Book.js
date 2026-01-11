const mongoose = require('mongoose');
const bookShema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    description: String,
    cover: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Book', bookShema);