
function toggleDropdown(dropdown){
	if(dropdown.attr('data-open') === 'false'){
		dropdown.show();
		dropdown.attr('data-open', 'true');
	}else{
		dropdown.hide();
		dropdown.attr('data-open', 'false');
	}
}

$('.dropdown-icon').on('click', function(){
	var list = $(this).next();
	toggleDropdown(list)
	
})

$('.dropdown-links li').on('click', function(){
	var text = $(this).text();

	$(this).parent().parent().children('span').text(text);
	toggleDropdown($(this).parent())
})


/* Set the width of the side navigation to 250px */
function openNav() {
    $('.sidenav').css('width', '250px')
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $('.sidenav').css('width', '0px')
}

$('input').on('focus', function(){
	$(this).removeClass('error-input');
})


















