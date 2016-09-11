function filterCount(count, filter){
	filter = filter.trim();
	if(filter == '< 5' && count < 5){
		return true;
	}else if(filter =='5-10' && count<=10 && count >=5){
		return true;
	}else if(filter == '11-20' && count < 20 && count >=11){
		return true;
	}else if(filter == '> 20' && count >20){
		return true;
	}else{
		return false;
	}
}

function validFilter(str){
	str = str.trim();
	if(str == '< 5' || str == '5-10' 
		|| str == '11-20' || str == '> 20'){
		return true;
	}else{
		return false;
	}
}


$('#filterBut').on('click', function(){
	var peopleCount = $('#people-count-filter').text();
	if(!validFilter(peopleCount)){
		alert('invalid filter')
	}else{
		$('.people-fed-count').each(function(){
			var post = $(this).parent().parent();
			var count = Number($(this).text());
			console.log(count)
			if (filterCount(count, peopleCount)){
				post.show();
			}else{
				post.hide();
			}	
		})
	}
	
})

