// Map Markers
var mapMarkers = [{
	address: "319 Alton Boulevard, Birmingham, AL 35243",
	html: "<strong>Alabama Clinic</strong><br>319 Alton Boulevard, Birmingham, AL 35243<br><br><a href='#' onclick='mapCenterAt({latitude: 33.44792, longitude: -86.72963, zoom: 16}, event)'>[+] zoom here</a>",
	/*icon: {
		//image: "img/pin.png",
		iconsize: [26, 46],
		iconanchor: [12, 46]
	}*/
}];

// Map Initial Location
var initLatitude = 37.09024;
var initLongitude = -95.71289;

// Map Extended Settings
var mapSettings = {
	controls: {
		panControl: true,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: true,
		streetViewControl: true,
		overviewMapControl: true
	},
	scrollwheel: false,
	markers: mapMarkers,
	latitude: initLatitude,
	longitude: initLongitude,
	zoom: 5
};

var map = $("#map").gMap(mapSettings);

// Map Center At
var mapCenterAt = function(options, e) {
	e.preventDefault();
	$("#map").gMap("centerAt", options);
}