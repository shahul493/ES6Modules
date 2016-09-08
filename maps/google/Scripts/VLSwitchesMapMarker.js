'use strict';
(function (namespace, $, undefined) {
  var switchesMarkers = null;  
  var icons = { 
		     	rollOverIcon : "images/bullet_ball_yellow.png",
		     	icon : "images/bullet_ball_blue.png"
		   	  };

  namespace.clearMarkers = function () {
  	if (switchesMarkers != null) {
        while (switchesMarkers.length) {
          switchesMarkers.pop().setMap(null);	
        }
        switchesMarkers = null;
	}    
  };

  namespace.createSwitchesMarkers = function (map, assets, vlSwitchesInfoWindow) {  	
  	var bounds = new google.maps.LatLngBounds();
  	var latLngs = null;  	
  	if (switchesMarkers == null) {
      switchesMarkers = [];
    }
    else
    {
    	while (switchesMarkers.length) {
          switchesMarkers.pop().setMap(null);
        }
        switchesMarkers = null;
    }
	if(latLngs == null)
		latLngs = [];
    for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      var image = icons.icon;            
	  var position = null;
  	  var rolloverImage = icons.rollOverIcon;  	  
      latLngs.push(new google.maps.LatLng(asset.latitude, asset.longitude));
      bounds.extend(new google.maps.LatLng(asset.latitude, asset.longitude));      
      var myLatLng = new google.maps.LatLng(asset.latitude, asset.longitude); 
      var marker = new google.maps.Marker({
        position: myLatLng,
        icon: image,        
        map:map,
	    title:asset.dateTimeForMapDisplay,
        eventID:asset.switchDetailsEventID,
        asset:asset,
        normalIcon:image,
        rolloverImage:rolloverImage,
        icons:icons
      });

      google.maps.event.addListener(marker, 'click', function (asset, map, vlSwitchesInfoWindow, iconsArray) {      	
        return function () {        
          if(typeof mapToGridSelection !== "undefined"){
            mapToGridSelection(asset.switchDetailsEventID);
          }
        	vlSwitchesInfoWindow.createSwitchesInfoWindow(map, asset);
        	this.setIcon(this.rolloverImage);        	        	
        };
      } (asset, map, vlSwitchesInfoWindow, icons));
      
      google.maps.event.addListener(marker, 'mouseover', function (asset, map, iconsArray) {
        return function () {
          this.setIcon(this.rolloverImage);
        };
      } (asset, map, icons));

      google.maps.event.addListener(marker, 'mouseout', function (asset, map) {
        return function () {
         	this.setIcon(this.normalIcon);
        };
      } (asset, map));
		switchesMarkers.push(marker);
    }
	   map.fitBounds(bounds);
	  	
    return switchesMarkers;
  };
  
})(window.VLSwitchesMarkers = window.VLSwitchesMarkers || {}, jQuery);