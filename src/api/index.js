'use strict';

var express = require('express');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var mongoose = require('mongoose');

var router = express.Router();
var dateTime = require('../date.js')



router.post('/user', function(req, res){
	var user = (req.body);
	var useremail = user.email;
	User.findOne({email: useremail}, function(err,user){
		if(err){
			res.status(500).send('server error!')
		}
		else if(!user){
			User.create(user, function(err, user){
				if(err){
					res.status(500).json({message : 'user not posted'});
				}else{
					req.session.userid = user._id.toString();
					res.json({message : 'user created', id : user._id.toString()})
				}
			})
		}else{
			res.status(500).send('email already used')
		}
	})
})

router.put('/user', function(req, res){
	var user = req.body;

	var userid = mongoose.Types.ObjectId(req.query.userid);
	User.findByIdAndUpdate(userid, user, function(err, user){
		if(err){
			return res.status(500).json({err : err.message});
		}else{
			res.json({message: 'succesful'})
		}
	})
})

router.post('/login', function(req, res){
	var login = req.body;

	User.findOne({'email': login.email}, function(err, user){
		if(err){
			return res.status(500).json({message : 'login unsuccessful'})
		}else{
			if(!user){
				return res.status(500).json({message : 'user not found'})
			}else{
				console.log(user)
				if(user.password === login.password){
					console.log('in')
					console.log(user)
					req.session.userid = user._id.toString();
					res.json({message : 'success', id: user._id.toString()})
				}else{
					res.json({message: 'password incorrect'})
				}
			}
		}
	})
})

router.post('/post', function(req, res){
	var date =  new Date();
	var post = req.body;
	console.log(post)
	post.active = true;
	post.postDate = dateTime.getDate(date.getTime())
	post.postTime = dateTime.getTime(date.getTime())

	var userid = mongoose.Types.ObjectId(post.userid);

	User.findOne({_id:userid}, function(err, user){
		if(err){
			res.status(500).send({'message' : 'user info incorrect'})
		}else{
			console.log(user)
			if(!user.address || !user.contact){
				res.status(500).send({'message' : 'unsuccessful - address or contact missing'})
			}else{
				Post.create(post, function(err, post){
					if(err){
						res.status(500).send({'message' : 'error in creating a post'})
					}else{
						res.send({'message' : 'succesful post', post :post})
					}
				})
			}

		}
	})
	
	
})

router.put('/post', function(req, res){
	var postid = mongoose.Types.ObjectId(req.query.postid);
	var post = req.body;
	Post.findByIdAndUpdate(postid, post, {new: true}, function(err){
		if(err){
			res.status(500).json({message: 'error updating post'})
		}else{
			res.json({message: 'update succesful', post : post})
		}
	})
})

router.delete('/post', function(req, res){
	var postid = mongoose.Types.ObjectId(req.query.postid);

	Post.remove({_id: postid}, function(err){
		if(err){
			res.status(500).json({message: 'could not delete post'})
		}else{
			res.json({message: 'post deleted succesfully'})
		}
	})
})

router.get('/logout', function(req, res){
	req.session = null;
	res.redirect('/')
})

router.put('/password', function(req, res){
	var userid = mongoose.Types.ObjectId(req.query.id);
	var currPassword = req.body.currPassword;
	var newPassword = req.body.newPassword;
	console.log(currPassword, newPassword, userid)
	if(!newPassword.validPassword()){
			res.status(500).json({message : 'new password is invalid'})
	}else{
		User.findOne({_id : userid}, function(err, user){
			if(err){
				res.status(500).json({message: 'cannot find user'})
			}else{
				if(user.password != currPassword){
					res.status(500).json({message: 'current password is not correct'})
				}else{
					User.findByIdAndUpdate(userid, function(err){
						if(err){
							res.status(500).json({message : 'could not update password'})
						}else{
							res.json({message: 'password updated'})
						}
					})
				}
			}
		})
	}
})

router.delete('/delete/account', function(req, res){
	var userid = mongoose.Types.ObjectId(req.query.id);
	User.findByIdAndRemove(userid, function(err){
		if(err){
			res.status(500).json({message: 'fail'})
			console.log('in')
		}else{
			req.session = null;
			Post.remove({userid: userid.toString()}, function(err){
				if(err){
					console.log('in')
					res.status(500).json({message : 'fail'})
				}else{
					console.log('in')
					res.redirect('/')
				}
			})

		}
	})
})



//validations scaffold them...
String.prototype.isEmpty = function(str){
	 return (!this.trim() || this.length === 0)
}

String.prototype.validPassword = function(pass){
	return (!(this.isEmpty()) && this.length >= 6 && !this.hasSpaces());
}

String.prototype.hasSpaces = function(str){
	var newStr = this.trim();
	var n = newStr.indexOf(' ');

	return (n != -1);
}






module.exports = router;