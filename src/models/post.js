'use strict'

var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	postDate: String,
	postTime: String,
	userid: String,
	description: String,
	pickupDate: String,
	pickupTime : String,
	active: Boolean,
	peopleFed : Number,

})

var model = mongoose.model('Post', postSchema);

module.exports = model;
