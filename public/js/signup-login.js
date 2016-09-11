String.prototype.isEmpty = function(text){
	 return (this.length === 0 || !this.trim())
}

String.prototype.isValidName = function(str){
	if(!(this.isEmpty()) && this.trim().length>=2){
		return true;
	}else{
		return false;
	}
}

String.prototype.isValidEmail = function(x){
	var atpos = this.indexOf("@");
    var dotpos = this.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=this.length) {
        return false;
    }else{
    	return true;
    }
}

String.prototype.isValidPassword = function(str){
	if(!(this.isEmpty()) && this.trim().length >= 6 && !this.hasSpaces()){
		return true;
	}else{
		return false;
	}
}

String.prototype.hasSpaces = function(str){
	var newStr = this.trim();
	var n = newStr.indexOf(' ');

	return (n != -1);
}

$('#signup').on('click', function(){

	var name = $('#name').val()
	var email = $('#email').val()
	var password = $('#password').val()

	console.log(name, email, password)

	if( !email.isValidEmail() || !password.isValidPassword()){
		// if(!name || !(name.isValidName())){
		// 	$('#name').attr('placeholder', 'Name must be atleast 2 characters long')
		// }
		if(!email || !(email.isValidEmail())){
			$('#email').attr('placeholder', 'Enter a valid email')
			$('#email').addClass('error-input')
		}
		if(!password || !(password.isValidPassword())){
			$('#password').attr('placeholder', 'Password must be atleast 6 characters long')
			$('#password').addClass('error-input')
		}
		return;
	}
	else{
		user = {
			'email': email,
			'name' : name,
			'password' : password,
		}

		$.ajax({
			url: '/api/user',
			type: 'POST',
			// dataType : 'json',
			data: JSON.stringify(user),
			contentType: 'application/json',
			success : function(res){
				if(res.message === 'user created'){
					window.location.href = '/user-dash/'+res.id
				}
			},
			error: function(res){
				alert('could not create user')
			}
		})
	}
	
})

$('#login').on('click', function(){
	var user = {
		'email' : $('#emailLogin').val(),
		'password' : $('#passwordLogin').val(),
	}

	$.ajax({
		url: '/api/login',
		type: 'POST',
		// dataType : 'json',
		data: JSON.stringify(user),
		contentType: 'application/json',
		success : function(res){
			if(res.message == 'success'){
				console.log('in')
				window.location = '/user-dash/'+res.id;
			}else{
				alert(res.data.message);
			}
			
		},
		error: function(res){
			alert(res.data.message);
		}
	})

})

function togglePassword(item){
	if(item.attr('type') === 'text'){
		item.attr('type', 'password');
	}else if(item.attr('type') === 'password'){
		item.attr('type', 'text');
	}else{

	}
}

$('.form label img').on('click', function(){
	togglePassword($(this).parent().next());
})








