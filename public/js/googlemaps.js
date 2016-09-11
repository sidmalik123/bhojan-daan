

function getMarker(results){
		var position =  new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());

		var marker = new google.maps.Marker({
							position : position,
						})

		return marker;
}



function initialize(){
	var mapCanvas = document.getElementById("map");
	var mapOptions = {
	    center: new google.maps.LatLng(28.466945, 77.066520), zoom: 12
	}
	var map = new google.maps.Map(mapCanvas, mapOptions);

	var marker;
	$('.useradd').each(function(){
		var useradd =  $(this).text();
		
		var locationPromise = new Promise(function(resolve, reject){
		      var geocoder = new google.maps.Geocoder();
			  geocoder.geocode( { 'address': useradd}, function(results, status) {

			  if (status == google.maps.GeocoderStatus.OK) {
			  	  resolve(results)
			      } 
			  }); 
			
		}).then(function(results){
			var marker = getMarker(results);

			var infowindow = new google.maps.InfoWindow({
			  content: useradd
			});

			google.maps.event.addListener(marker, 'mouseover', function() {
			  infowindow.open(map,marker);
			});

			google.maps.event.addListener(marker, 'mouseout', function() {
			  infowindow.close(map,marker);
			});
			
			marker.setMap(map);
		})
	})

}

google.maps.event.addDomListener(window, 'load', initialize);