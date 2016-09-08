'use strict';
(function (namespace, $, undefined) {
  var hoursLocationMarkers = null;
  var historyPolyline = null;
  var icons = { firstEventIcon : "images/bullet_ball_green.png",
		     lastEventIcon :"images/bullet_ball_red.png",
		     rollOverIcon : "images/bullet_ball_yellow.png",
		     icon : "images/bullet_ball_blue.png"
		   };
  var directions={
  	NORTH:1,
  	NORTH_EAST:2,
  	EAST:3,
  	SOUTH_EAST:4,
  	SOUTH:5,
  	SOUTH_WEST:6,
  	WEST:7,
  	NORTH_WEST:8
  };
  var zIndex = 0;
  var markerZIndex;
  var maxZindex = 9999;
  var startingZindex = 9998;
  var positions = {
  	NORMAL:1,
  	SELECTION:2,
  	STARTING:3,
  	ENDING:4
  };
  var dimensions = {
  	WIDTH:15,
  	HEIGHT:15
  };
  
  namespace.clearMarkers = function () {
  	if (hoursLocationMarkers != null) {
        while (hoursLocationMarkers.length) {
          hoursLocationMarkers.pop().setMap(null);
        }
        hoursLocationMarkers = null;
		historyPolyline.setMap(null);      
    }
    
  };
  namespace.createHoursLocationMarkers = function (map, assets,vlAssetInfoWindow) {
  	var bounds = new google.maps.LatLngBounds();
  	var latLngs = null;
  	if (hoursLocationMarkers == null) {
      hoursLocationMarkers = [];
    }
    else
    {
    	while (hoursLocationMarkers.length) {
          hoursLocationMarkers.pop().setMap(null);
        }
        hoursLocationMarkers = null;
    }
    
    if(historyPolyline != null)
    {
    	historyPolyline.setMap(null);
    	historyPolyline = null;
    }
	if(latLngs == null)
		latLngs = [];
	var isArrowHeadedLine = false;
	
    for (var i = 0; i < assets.length; i++) {
    
      var asset = assets[i];
      var image;
      var rolloverImage;
      var startingX = null;
	  var startingY = null;
      var shape = null;
	  var position = null; 
	  var originX=null;
	  var originY=null;
      var direction;
      isArrowHeadedLine = !(isNaN(asset.track));
      
      if(!isArrowHeadedLine)
      {
      	  rolloverImage = icons.rollOverIcon;
      	  if(assets.length == 1)
      	  {
      	  	image = icons.icon;
		    markerZIndex = startingZindex;
      	  }
      	  else
      	  {	
		      if(i==0)
		      {
		     	 image = icons.lastEventIcon;
		     	 markerZIndex = maxZindex ;
		     }
		      else if(i == assets.length-1)
		      {
		      	image = icons.firstEventIcon;
		      	markerZIndex = startingZindex;
		      }
		      else
		      {
		      	image = icons.icon;
		      	markerZIndex = ++zIndex;
		      }
	      }
	  }
      else
      {
      
      	if(asset.track < 0)
      		asset.track =  360 + asset.track;
      	switch(parseInt(asset.track / 22.5))
      	{
      		case 0:
      		case 15:
      			direction = directions.NORTH;
      			break;
      		case 1:
      		case 2:
      			direction = directions.NORTH_EAST;
      			break;
      		case 3:
      		case 4:
      			direction = directions.EAST;
      			break;
      		case 5:
      		case 6:
      			direction = directions.SOUTH_EAST;
      			break;
      		case 7:
      		case 8:
      			direction = directions.SOUTH;
      			break;
      		case 9:
      		case 10:
      			direction = directions.SOUTH_WEST;
      			break;
      		case 11:
      		case 12:
      			direction = directions.WEST;
      			break;
      		case 13:
      		case 14:
      			direction = directions.NORTH_WEST;
      			break;
      		default:
      			direction = directions.NORTH;
      	}
      	if(assets.length == 1)
	  	{
	  	  	position = positions.NORMAL;
		      	markerZIndex = startingZindex;
		      	zIndex = 0;
	  	}
	  	else
	  	{
	      	if(i==0)
	      	{
		     	position = positions.ENDING;
		     	 markerZIndex = maxZindex ;
		    }
		    else if(i == assets.length-1)
		    {
		      	position = positions.STARTING;
		      	markerZIndex = startingZindex;
		      	zIndex = 0;
		     }
		    else
		    {
		      	position = positions.NORMAL;
		      	markerZIndex = ++zIndex;
		     }
	     }
	   
	    startingX = direction == directions.NORTH ? 1 : (direction-1) * dimensions.WIDTH ;
	    startingY = position ==  positions.NORMAL ? 1 : (position-1) * dimensions.HEIGHT;
	   
	    image = {
		  	url:'images/arrows.png',
		  	size:new google.maps.Size(15,15),
		  	origin : new google.maps.Point(startingX,startingY),
		  	anchor : new google.maps.Point(7,7)
		};
	    rolloverImage = {
	    	url:'images/arrows.png',
		  	size:new google.maps.Size(15,15),
		  	origin : new google.maps.Point(startingX,15),
		  	anchor : new google.maps.Point(7,7)
	    };
	    
	    shape = {
	    	 coords: [1,1, 1,15,15,15,15,1],
	    	 type: 'poly'
	    };
      }
     latLngs.push(new google.maps.LatLng(asset.latitude, asset.longitude));
     bounds.extend(new google.maps.LatLng(asset.latitude, asset.longitude));
     var myLatLng = new google.maps.LatLng(asset.latitude, asset.longitude);
      
      
      
      var marker = new google.maps.Marker({
        position: myLatLng,
        icon: image,
        shape:shape,
        map:map,
	    title:asset.EventTimeStampToDisplay,
        eventID:asset.RuntimeLocationEventID,
        asset:asset,
        normalIcon:image,
        rolloverImage:rolloverImage,
        icons:icons,
        isArrowHeadedLine:isArrowHeadedLine,
        direction:direction
        
        
      });
	  marker.setZIndex(markerZIndex);
      google.maps.event.addListener(marker, 'click', function (asset, map,vlAssetInfoWindow,iconsArray) {
        return function () {
          if(typeof mapToGridSelection !== "undefined"){
            mapToGridSelection(asset.RuntimeLocationEventID);
          }
          	this.setIcon(this.rolloverImage);
        	vlAssetInfoWindow.createInfoWindow(map,asset);
        };
      } (asset, map,vlAssetInfoWindow,icons));
      google.maps.event.addListener(marker, 'mouseover', function (asset, map,iconsArray) {
        return function () {
          this.setIcon(this.rolloverImage);
        };
      } (asset, map,icons));
      
      google.maps.event.addListener(marker, 'mouseout', function (asset, map) {
        return function () {
         	this.setIcon(this.normalIcon);
        };
      } (asset, map));
		hoursLocationMarkers.push(marker);
    }
    
    
      historyPolyline = new google.maps.Polyline({
		    path: latLngs,		    
		    strokeColor: '#6699FF',
		    strokeOpacity: 1.0,
		    strokeWeight: 2    
		});
	  	historyPolyline.setMap(map);
	  	map.fitBounds(bounds);
	  	
    return hoursLocationMarkers;
  };
  
})(window.VLHoursLocationMarkers = window.VLHoursLocationMarkers || {}, jQuery);
