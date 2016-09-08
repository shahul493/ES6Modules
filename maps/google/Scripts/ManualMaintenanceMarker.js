'use strict';
(function (namespace, $, undefined) {

  //---This is the using the Google Maps Marker functions and custom images------------//
   var marker = null;
   var myLatLng = null;
  
  
 //TODO: Rename to clearAssetMarkers
  namespace.clearMapMarkers = function () {
  	
    if (marker != null) {
        marker.setMap(null);
        marker = null;
    }
  };
	namespace.createMaintenanceMarkers = function (map, manualMaintenanceData,isSetCenterRequired) {
		if(marker != null)
			marker.setMap(null);
		else	
   	  		marker = null;
      myLatLng = new google.maps.LatLng(manualMaintenanceData.latitude, manualMaintenanceData.longitude);
      var image = "images/map_marker_icon.png";
       marker = new google.maps.Marker({
        position: myLatLng,
        icon: image,
        manualMaintenanceData:manualMaintenanceData
      });
	 marker.setMap(map);
	 if(isSetCenterRequired)
	 	map.setCenter(myLatLng);
  };
  
  namespace.changeMarkerPosition = function(map,latLng)
  {
  	myLatLng = latLng;
  	marker.setPosition(latLng);
  	/map.setCenter(latLng);*/
  };
  namespace.getMarker = function()
  {
  	return marker;
  };
  


})(window.ManualMaintenanceMarker = window.ManualMaintenanceMarker || {}, jQuery);
