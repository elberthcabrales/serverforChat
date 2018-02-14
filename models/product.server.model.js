'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TodoSchema = new Schema({
    text: String,
    completed: Boolean
});
module.exports = mongoose.model('Todo', TodoSchema)