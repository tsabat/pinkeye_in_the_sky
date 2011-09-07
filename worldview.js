// Just in case I guess
$(window).load(function() {

	// alextodo, markers and coordinates all need to be removed from map
    // and newly assigned after every new ajax request because otherwise they will grow too large
	var markers = new Array(),
	    coordinates = new Array(),
	    map,
	    i,
	    callBackInterval = 60,
	    showInterval = 1,
	    numberOfCordinatesShownAtOneTime = 1,	
		ticks = 0, // alextodo, will have to reset the ticks after a call back
		nextShowInterval = 0,
		setupMarkersTime = 1,
		// test with 10 seconds, real should be 180 (3 minutes?)
		clearMarkersTime = 10;
		// the time markers should be shown
		// alextodo clear the nextShowInterval time on call back from server

	function setUpMarkers() {
		
		if (((ticks === 0) || (ticks === nextShowInterval)) && coordinates.length > 0) {
			
			for( i = 0; i < numberOfCordinatesShownAtOneTime; i++ ) {
				
				var coordinate = coordinates.pop(),
				    image = "Bleep.gif?random=" + coordinate.lat() + coordinate.lng();
			
				// Only calling this once? 
				// console.log("Setting a marker");
			
				var marker = new google.maps.Marker({
					position: coordinate,
					icon: image,
					optimized: false,
					map: map
				});
			
				marker.ticks = ticks;
				markers.push(marker);
				
			};
		
			nextShowInterval += showInterval;
		};
	
		ticks++;
		
	};

	function setUpMap() {
		
		var centerOfTheWorld = new google.maps.LatLng(40.97989806962013, -31.640625);
	
		var options = {
			zoom: 2,
			scrollwheel: false,
			disableDoubleClickZoom: true,
			zoomControl: false,
			center: centerOfTheWorld,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("map_canvas"), options);
	};

	function getCoordinates() {
		$.getJSON('http://css-tricks.com/wufoo/dummydata/dummydata.json?callback=?', function(data) {
			for(var index in data.coordinates) {
                var coordinate = data.coordinates[index];
                
                coordinates.push(new google.maps.LatLng(coordinate.latitude, coordinate.longitude));
            }
            
            calculateIntervals();
		});
		
	};

    function calculateIntervals() {
        if(coordinates.length > callBackInterval) {
            showInterval = 1;
            numberOfCordinatesShownAtOneTime = Math.ceil(coordinates.length / callBackInterval);
        }
        else {
            numberOfCordinatesShownAtOneTime = 1;
            coordinatesLength = (coordinates.length > 0) ? coordinates.length : 1;
            showInterval = Math.floor(callBackInterval / coordinatesLength);
        }
    }
    
    function clearMarkers() {
        for ( i=0; i < markers.length; i++) {
            if((markers[i].ticks + clearMarkersTime) < ticks || markers[i].ticks == callBackInterval) {
                markers[i].setVisible(false);
            }
        }
    }
	
	setUpMap();
	getCoordinates();
		
	setInterval(setUpMarkers, setupMarkersTime * 1000);
	setInterval(clearMarkers, clearMarkersTime * 1000);
	
});