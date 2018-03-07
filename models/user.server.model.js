'use strict'

const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const Schema = mongoose.Schema;


var UserSchema = new Schema({
		username: {type:String, unique:true},
		email: {
            type: String,
            lowercase: true,
            unique: true,
            match: [/.+\@.+\..+/, "Please fill a valid email address"],
            required: [true, 'User email number required']
        },
		password: {
            type: String,
            required: 'Password is required',
            select : false,
            validate: [
                (password) => password && password.length > 6,
                'Password should be longer'
            ]
        },
		image: String,
        status: { type: String, enum:['online','offline','removed'], default:'offline'},
        created: {type: Date, default: Date.now},
       
});



UserSchema.methods.comparePassword = function(candidatePassword, hashed) {
    //console.log(candidatePassword, hashed)
	return passwordHash.verify(candidatePassword, hashed);
};

UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});
module.exports = mongoose.model('User', UserSchema);