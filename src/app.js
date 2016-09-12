'use strict'

var express = require('express');
var cookieSession = require('cookie-session');
var router = require('./api');
var path = require('path');
var parser = require('body-parser');
var mongoose = require('mongoose')
var async  = require('async')



require('./database.js')
var User = require('./models/user.js');
var Post = require('./models/post.js');


var app = express();

app.set('trust proxy', 1) // trust first proxy 
 
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(parser.urlencoded({
  extended: true
}));
app.use(parser.json());
app.use('/api', router);
app.use('/static', express.static(path.join(__dirname , '..', '/public')))
app.use('/plugin', express.static(path.join(__dirname , '..', '/plugins')))





app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '..' , 'templates'));

function callback(x){
	console.log(x);
}

// app.get('/index', function(req, res){
// 	res.sendFile(path.join(__dirname , '..', 'public' , 'html' ,'index.html'))
// })

app.get('/', function(req, res){
	var loggedInId;
	if(req.session.userid){
		loggedInId = req.session.userid;
	}
	Post.find({active : true}, function(err, posts){
		if(err){
			return res.status(500).send('<h2>Error loading Page!</h2>')
		}else{
			async.each(posts, function(post, callback){
					User.findOne({_id: mongoose.Types.ObjectId(post.userid)}, function(err, user){
						if(err){
							return res.status(500).send('<h2>Error loading Page!</h2>')
						}else{
							post.userName = user.name;
							post.userAddress = user.address;
							post.userContact = user.contact
							callback(null);
						}
					})
			}, function(err){
					console.log(err)
					if(err){

						return res.status(500).send('<h2>Error loading Pages!</h2>')
					}else{
						res.render('index', {posts: posts.reverse(), loggedInId: loggedInId})
					}

			});
		}
	})
})

app.get('/signup-login', function(req, res){
	if(req.session.userid){
		res.redirect('/')
	}else{
		res.sendFile(path.join(__dirname , '..', 'public' , 'html' ,'signup-login.html'))
	}
	
})

app.get('/become-a-donor', function(req, res){
	res.sendFile(path.join(__dirname , '..', 'public' , 'html' ,'become-a-donor.html'))
})

app.get('/user-posts/:id?', function(req, res){
	var loggedInId;
	var pageActive;
	if(req.session.userid){
		loggedInId = req.session.userid;
		if(req.session.userid === req.params.id){pageActive = true;}
	}

	var id = req.params.id;
	User.findOne({_id : mongoose.Types.ObjectId(id)}, function(err, user){
		if(err){
			res.status(500).send("error loading user's posts.")
		}else{
			var userName = user.name;
			var userAddress = user.address;
			var userContact = user.contact;
			var userid = user._id;
			Post.find({userid : id}, function(err, posts){
				if(err){
					res.status(500).send('error loading posts.')
				}else{
					res.render('posts', {
						posts: posts.reverse(),
						userName : userName,
						userAddress : userAddress,
						userContact : userContact,
						userid : userid,
						loggedInId : loggedInId,
						pageActive : pageActive
					})
				}
			})
		}
	})
})

app.get('/user-dash/:id', function(req, res){
	
	if(req.session.userid === req.params.id){
		var id = mongoose.Types.ObjectId(req.session.userid);
		User.findOne({_id : id}, function(err, user){
			if(err){
				return;
			}else{
				Post.find({userid: id.toString()}, function(err, posts){
					if(err){
						res.status(500).json({message: 'error loading page'})
					}else{
						var totalFed = 0;
						var totalPosts = 0;
						posts.forEach(function(post){
							totalFed += post.peopleFed;
							++totalPosts;
						})

						res.render('userdash', {user : user, active: true,
						 totalFed : totalFed, totalPosts: totalPosts, loggedInId: req.session.userid});
					}
					
				})
				
			}
		})
	}else{
		var id = mongoose.Types.ObjectId(req.params.id);
		User.findOne({_id : id}, function(err, user){
			if(err){
				return;
			}else{
				Post.find({userid: id.toString()}, function(err, posts){
					if(err){
						res.status(500).json({message: 'error loading page'})
					}else{
						var totalFed = 0;
						var totalPosts = 0;
						posts.forEach(function(post){
							totalFed += post.peopleFed;
							++totalPosts;
						})

						res.render('userdash', {user : user, active: false,
						 totalFed : totalFed, totalPosts: totalPosts,
						  loggedInId: req.session.userid, recentPosts : posts.splice(0,2)} );
					}
					
				})
			}
		})	
	}

})

app.get('/prac', function(req, res){
	res.sendFile(path.join(__dirname , '..', 'public' , 'html' ,'userdash.html'))
})




app.listen(process.env.PORT || 3000, function(){
	console.log('serve running at port 3000 :)');
})