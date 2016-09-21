function initializeModal(){
	$('#userDescriptionModal').val($('#userDescription').text().trim());
	$('#userAddress').val($('#address').text().trim());
	$('#userContact').val($('#contact').text().trim());
}

initializeModal();


$('#post').on('click', function(){
	var description = $('#description').val();
	console.log(description);
	var date = $('#date').val();
	var time = $('#time').val();
	var peopleCount = $('#peopleCount').val();

	if(description.isEmpty() || date.isEmpty() || time.isEmpty() || peopleCount.isEmpty()){
		if(description.isEmpty()){
			$('#description').addClass('error-input')
		}
		if(date.isEmpty()){
			$('#date').addClass('error-input')
		}
		if(time.isEmpty()){
			$('#time').addClass('error-input')
		}
		if(peopleCount.isEmpty()){
			$('#peopleCount').addClass('error-input')
		}
		return;
	}else{
		var post = {
			'pickupDate' : date,
			'pickupTime' : time,
			'peopleFed' : peopleCount,
			'description' : description,
			'userid' : $('#post').attr('data-id')
		}
		
		$.ajax({
			url: '/api/post',
			type: 'POST',
			data: JSON.stringify(post),
			dataType : 'json',
			contentType: 'application/json',
			success : function(res){
				console.log(res)
				alert(res.message);
				$('#description, #date, #time, #peopleCount').val('');

				var prevDonations = Number($('.total-donations h1').text());
				$('.total-donations h1').text((+prevDonations + 1).toString());

				var prevPeople = Number($('.total-people-fed h1').text());

				$('.total-people-fed h1').text((+prevPeople + +post.peopleFed).toString())
			},
			error: function(res){
				alert('could not make a post');
				
			}
		})
	}
})

$('#updateBut').on('click', function(){
	var description = $('#userDescriptionModal').val();
	var address = $('#userAddress').val();
	var contact = $('#userContact').val();
	
	if(description.isEmpty() || address.isEmpty() || contact.isEmpty()){
		if(description.isEmpty()){
			$('#userDescription').addClass('error-input')
		}
		if(address.isEmpty()){
			$('#userAddress').addClass('error-input')
		}
		if(contact.isEmpty()){
			$('#userContact').addClass('error-input')
		}
		return
	}else{
		var user = {
			'description' : description,
			'address' : address+', Gurgaon',
			'contact' : contact,
		}

		$.ajax({
			url: '/api/user?userid='+$('#editInfo').attr('data-id'),
			type: 'PUT',
			data: JSON.stringify(user),
			contentType: 'application/json',
			success : function(res){
				location.reload();
			},
			error: function(res){
				alert(res.responseJSON.message);
				
			}
		})
	}
})

$('.top-division img').on('click', function(){
		toggleSettings();
	})

function toggleSettings(){
	var settings = $('.settings');
	if(settings.attr('data-open') === 'false'){
		settings.attr('data-open', 'true')
		var height;
		if($(window).width() >= 1000){
			height = 425;
		}else{
			height = 525;
		}
		settings.css('height', height+'px')
		$('.top-division img').css('transform', 'rotate(180deg)')
	}else{
		settings.attr('data-open', 'false')
		settings.css('height', '0')
		$('.top-division img').css('transform', 'rotate(0deg)')
	}
}

$('#changePassBut').on('click', function(){
	var currPassword = $('#currPassword').val();
	var newPassword = $('#newPassword').val();
	console.log(currPassword, newPassword)

	if(!currPassword.validPassword() || !newPassword.validPassword()){
		if(!currPassword.validPassword()){
			$('#currPassword').addClass('error-input');
			alert('current password is invalid, password cannot '+
			 'contain spaces and must be atleast 6 characters long')
		}
		if(!newPassword.validPassword()){
			$('#newPassword').addClass('error-input');
			alert('new password is invalid, password cannot '+
			 'contain spaces and must be atleast 6 characters long')
		}
		return;
	}else{
		var pass = {
			'currPassword' : currPassword.trim(),
			'newPassword' : newPassword.trim(),
		}

		$.ajax({
			url : '/api/password',
			type: 'PUT',
			data: JSON.stringify(pass),
			contentType: 'application/json',
			success : function(res){
				alert('password updated successfully');
			},
			error: function(res){
				alert('fail');
				
			}
		})
	}
})

$('#delAccBut').on('click', function(){
	var userid = $(this).attr('data-id');
	$.ajax({
		url: '/api/delete/account?id='+userid,
		type: 'DELETE',
		success: function(res){
			
		},
		error: function(res){
			alert('fail')
		},
	})
})

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

