'use strict'

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	email: String,
	password : String,
	name: String,
	timestamp: Number,
	contact: String,
	city: String,
	// profilePic : ,
	// menu : ,
	description: String,
	address: String,

})

var model = mongoose.model('User', userSchema);

module.exports = model;