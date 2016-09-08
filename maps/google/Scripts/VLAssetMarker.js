'use strict';
(function (namespace, $, undefined) {

  //---This is the using the Google Maps Marker functions and custom images------------//
   var markers = null;
  var infoBox = null;
  
 //TODO: Rename to clearAssetMarkers
  namespace.clearMapMarkers = function () {
  	if (markers != null) {
        while (markers.length) {
          markers.pop().setMap(null);
        }
        markers = null;
    }
  };


  

  namespace.addAssetMarkers = function (map, assets) {
    createAssetMarkers(map, assets);
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        marker.setMap(map);
    }  
  }
  namespace.createDefaultMarkers = function(map,assets)
  {
	var pinColor = "6699ff";
	var pinOverColor = "ffcc00";
	var showAssetID = vss.common.EnumAssetLabelPreferenceType.showAssetID(map.vlMapOptions.assetLabelPreference);
	var showSerialNumber = vss.common.EnumAssetLabelPreferenceType.showSerialNumber(map.vlMapOptions.assetLabelPreference);
	var tooltipString;
	var assetIDLabel = getString("assetID") +": ";
	var serialNumberLabel = getString("sn")+": ";
	
 	 var defaultMarkers = [];
	  for (var i = 0; i < assets.length; i++) 
	  {
		  var assetData = assets[i];
		  	tooltipString = "";	  
		  	if(showAssetID){
		  		tooltipString = assetIDLabel + assetData.assetName;
		  	}	  		
		  	if(showSerialNumber){
		  		tooltipString+= " " + serialNumberLabel + assetData.assetSerialNumber;
		  	}	
		  	var myLatLng = new google.maps.LatLng(assetData.latitude, assetData.longitude);
		   	var defaultMarker = new google.maps.Marker({
	        position: myLatLng,
	        icon:new google.maps.MarkerImage('images/zoneBalloon.png',
				new google.maps.Size(19, 24),
				new google.maps.Point(0,0),
				new google.maps.Point(6,24)
				),
	        title: tooltipString, 
	        zIndex: i + 1,
	        assetID:assetData.assetID
	      });
	      
		google.maps.event.addListener(defaultMarker, 'mouseout', function() {
			this.setIcon(new google.maps.MarkerImage('images/zoneBalloon.png',
			new google.maps.Size(19, 24),
			new google.maps.Point(0,0),
			new google.maps.Point(6,24)));
		});
		google.maps.event.addListener(defaultMarker, 'mouseover', function() {
		this.setIcon(new google.maps.MarkerImage('images/zoneBalloon_over.png',
			new google.maps.Size(19, 24),
			new google.maps.Point(0,0),
			new google.maps.Point(6,24)));
		});
		defaultMarkers.push(defaultMarker);
	      
	  }
	  return defaultMarkers;
  }
  
  
  namespace.createAssetMarkers = function (map, assets,vlAssetInfoWindow) {
    markers = null;
    if (markers == null) {
      markers = [];
    }
	for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      if(isNaN(asset.latitude) || isNaN(asset.longitude)) continue;
      var iconData = VLAssetMapMarkerData.getAssetMarker(asset.assetIconID);
      if(iconData == null)
     	iconData = VLAssetMapMarkerData.getAssetMarker(0);
      var image = {
        url: iconData.markerImgUrl,
        size: new google.maps.Size(iconData.width, iconData.height),
        origin: new google.maps.Point(iconData.originX, iconData.originY),
        anchor: new google.maps.Point(iconData.anchorX, iconData.anchorY)
      };
      var shape = {
        coord: [1, 1, 1, 44, 15, 30, iconData.width, 30, iconData.width, 1],
        type: 'poly'
      };

      var myLatLng = new google.maps.LatLng(asset.latitude, asset.longitude);
      var marker = new google.maps.Marker({
        position: myLatLng,
        icon: image,
        shape: shape,
        title: asset.assetName,
        zIndex: i + 1,
        assetID:asset.assetID,
        asset:asset
      });

      //keep reference to marker so we can delete it when needed
      markers.push(marker);
		
      google.maps.event.addListener(marker, 'click', function (asset, pos, map,vlAssetInfoWindow) {
        return function () {
          if(typeof mapToGridSelection !== "undefined"){
            mapToGridSelection(asset.assetID);
          }
        	vlAssetInfoWindow.createInfoWindow(map,asset);
        };
      } (asset, myLatLng, map,vlAssetInfoWindow));

    }
     
    return markers;
  };
  
  namespace.createCustomMarkers = function (map, assets,vlAssetInfoWindow) {
  
    var customMarkers = [];
   
	for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      if(isNaN(asset.latitude) || isNaN(asset.longitude)) continue;
      
      var myLatLng = new google.maps.LatLng(asset.latitude, asset.longitude);
      var marker = new CustomAssetMarker(myLatLng,map,asset,vlAssetInfoWindow);
	
      //keep reference to marker so we can delete it when needed
      customMarkers.push(marker);
		
      

    }
     
    return customMarkers;
  };

  namespace.toggleAssetMarkerVisibility = function (visible) {
    if (markers != null) {
      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        marker.setVisible(visible);
      }  
    }
  }



})(window.VLAssetMarker = window.AssetMarker || {}, jQuery);
