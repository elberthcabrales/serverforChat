'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessagecheSchema = new Schema({
    text: {type:String,required:true},
    from: {type: Schema.ObjectId,ref:'User' },
    to: {type: Schema.ObjectId,ref:'User' },
    created: {type: Date, default: Date.now},
});
module.exports = mongoose.model('Message', MessagecheSchema)