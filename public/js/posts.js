$('.edit').on('click', function(){
	var editLink = $(this);
	$('#postDescription').val(editLink.parent().parent().children('.description').text().trim());
	$('#date').val(editLink.parent().parent().children('.pickupDate').text().replace('Pick up by:', '').trim());
	$('#time').val(editLink.parent().parent().children('.pickupTime').text().trim());
	$('#postPeopleToFeed').val(editLink.parent().parent().children('.peopleFed').text().trim());
})



$('.edit').on('click', function(){
	var postid = $(this).attr('data-postid');

	$('#updatePost').on('click', function(){
		var description = $('#postDescription').val();
		var date = $('#date').val();
		var time = $('#time').val();
		var active = $("#postActiveCheckbox").is(":checked");
		var peopleFed = $('#postPeopleToFeed').val();

		if(description.isEmpty() || date.isEmpty() || time.isEmpty() || peopleFed.isEmpty()){
			if(description.isEmpty()){
				$('#postDescription').addClass('error-input')
			}
			if(date.isEmpty()){
				$('#date').addClass('error-input')
			}
			if(time.isEmpty()){
				$('#time').addClass('error-input')
			}
			if(peopleFed.isEmpty()){
				$('#postPeopleToFeed').addClass('error-input')
			}

			return
		}else{
			var post = {
				'description' : description,
				'pickupDate' : date,
				'pickupTime' : time,
				'active': active,
				'peopleFed': peopleFed,
			}

			$.ajax({
				url: '/api/post?postid='+postid,
				type: 'PUT',
				data: JSON.stringify(post),
				contentType: 'application/json',
				success : function(res){
					alert('post updated')
				},
				error: function(res){
					alert(res.responseJSON.message);
					
				}
			})
		}
	})

})

String.prototype.isEmpty = function(text){
	 return (this.length === 0 || !this.trim())
}

$('.delete').on('click', function(){
	var postid = $(this).attr('data-postid')
	var deleteBut = $(this);

	$.ajax({
		url : '/api/post?postid='+postid,
		type: 'DELETE',
		success: function(res){
			if(res.message === "post deleted succesfully"){
				alert('post deleted');
				deleteBut.parent().parent().remove();
			}
		},
		error: function(res){
			alert("error in deleting post")
		},
	})
})





