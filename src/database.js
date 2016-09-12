'use strict'

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/bhojan-daan', function(err){
	if(err){
		console.log('FAILED connecting to mongodb')
	}else{
		console.log('SUCCESFULY connected to mongodb')
	}
	
});