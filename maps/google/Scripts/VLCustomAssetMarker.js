"use strict";

function CustomAssetMarker(latlng, map,asset,infoWindow) {
	this.extend(CustomAssetMarker, google.maps.OverlayView);
     this.latlng_ = latlng;
	 this.position = latlng;
	 this.asset = asset;
	 this.mapInfoWindow_ = infoWindow;
	 this.openWindowListener = null;
     // Once the LatLng and text are set, add the overlay to the map.  This will
     // trigger a call to panes_changed which should in turn call draw.
     //this.setMap(map);
   }

   CustomAssetMarker.prototype.extend = function (obj1, obj2) {
	  return (function (object) {
	    for (var property in object.prototype) {
	      this.prototype[property] = object.prototype[property];
	    }
	    return this;
	  }).apply(obj1, [obj2]);
};

   CustomAssetMarker.prototype.draw = function() {
	 var me = this;
     
	 if(this.openWindowListener != null)
	 {
	 	google.maps.event.removeListener(this.openWindowListener);
	 	this.openWindowListener = null;
	 }		
    
     // Check if the div has been created.
     var div = this.div_;
     if (!div) {

        div = this.div_ = document.createElement('DIV');
        div.setAttribute('class', "callout border-callout");
        div.style.zIndex =2000;
        var divImg = document.createElement('DIV');
        divImg.setAttribute('class', "imgDiv");
        var image = document.createElement('IMG');
	    image.setAttribute('src','data:image/jpeg;base64,'+ getAssetIcon(this.asset.assetIconID));
	    image.setAttribute('class','calloutLabel');
	    divImg.appendChild(image);
		div.appendChild(divImg);
		var divText = document.createElement('DIV');
        var contentLebel = document.createElement('DIV');
        divText.setAttribute('class', "calloutLabelHolder");
        
        var calloutLbl = document.createElement('p');
		calloutLbl.setAttribute('class', "calloutLabel");
		divText.appendChild(calloutLbl);
		div.appendChild(divText);
        if(map.vlMapOptions.labelDetailOptions.labelMenuNone ==  false)
        	this.drawData(this.asset,calloutLbl,this);
	  	
        var divExpand = document.createElement("DIV");
        div.appendChild(divExpand);
        divExpand.setAttribute('class', "expandDiv");
        divExpand.innerHTML = "<img src='images/calloutExpandIcon.png' width='15' height='32'/>";

       // Then add the overlay to the DOM
       var panes = this.getPanes();
       panes.overlayImage.appendChild(div);
     }
	 else
	 {
 		var calloutLbl = this.div_.children[1].children[0];
	 	this.drawData(this.asset,calloutLbl,this)
	 }
     // Position the overlay 
     var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
     if (point) {
       div.style.left = (point.x - 10 - 10) + 'px';
       div.style.top = (point.y - 35 - 10) + 'px';
     }
     
	 this.openWindowListener = google.maps.event.addDomListener(this.div_, "click", function (asset, infowindow) {
    	return function () {
            if(typeof mapToGridSelection !== "undefined"){
       				 mapToGridSelection(asset.assetID);
      		}
      		setTimeout(function(){infowindow.createInfoWindow(map,asset)},500);
        }
	 } (this.asset, this.mapInfoWindow_));
     
  };

   CustomAssetMarker.prototype.remove = function() {
     // Check if the overlay was on the map and needs to be removed.
     if (this.div_) {
       this.div_.parentNode.removeChild(this.div_);
       this.div_ = null;
     }
   };

   CustomAssetMarker.prototype.getPosition = function() {
    return this.position;
   };
   CustomAssetMarker.prototype.getDraggable = function() {
   	return false;
   };
    CustomAssetMarker.prototype.getVisible = function() {
   	return true;
   };
   CustomAssetMarker.prototype.drawData = function(asset,calloutLbl,thisObj){
   
   		 if(map.vlMapOptions.labelDetailOptions.labelMenuNone)
   		 {
   		 	calloutLbl.innerHTML  = "";
   		 }
   		 if(map.vlMapOptions.labelDetailOptions.labelMenuAssetID)
	  	 {
	  	 	if(asset.assetName ==  null || asset.assetName == "")
	  			calloutLbl.innerHTML  = "-";
	  		else	
	  			calloutLbl.innerHTML  = asset.assetName;
	  	 }
	  	  if(map.vlMapOptions.labelDetailOptions.labelMenuSerialNumber)
	  	 {
	  	 	if(asset.assetSerialNumber ==  null || asset.assetSerialNumber == "")
	  			calloutLbl.innerHTML  = "-";
	  		else	
	  			calloutLbl.innerHTML  = asset.assetSerialNumber;
	  	 }
	  	 if(map.vlMapOptions.labelDetailOptions.labelMenuDateLastReported == true)
	  	  	calloutLbl.innerHTML  = asset.lastReportUTCDisplay;
	     if(map.vlMapOptions.labelDetailOptions.labelMenuVIN)
	  	 	calloutLbl.innerHTML  = asset.vinToDisplay;
	  	 if(map.vlMapOptions.labelDetailOptions.labelMenuHours && vss.common.EnumMeterLabelPreferenceType.showHourMeter(map.vlMapOptions.meterLabelPreference))
	  	 	calloutLbl.innerHTML  = asset.runtimeHoursDisplay;
	  	 if(map.vlMapOptions.labelDetailOptions.labelMenuFuelPercentRemaining)
	  		calloutLbl.innerHTML  = asset.fuelPercentRemainingToDisplay;
	  	 if(map.vlMapOptions.labelDetailOptions.labelMenuLocation)	
	  	 {
	  		thisObj.locationContainer = calloutLbl;
	  		if(asset.location == null || asset.location == "")
	  		{
	  				var address = getReverseGeoAddress(asset.latitude,this.asset.longitude);
					calloutLbl.innerHTML  = address;
					asset.location = address;
	  		}
	  		else
	  			calloutLbl.innerHTML  = asset.location;
	  	}
	  	if(map.vlMapOptions.labelDetailOptions.labelMenuLastKnownState)
	  		calloutLbl.innerHTML  =  asset.lastStateIDDisplay;
	  	if(map.vlMapOptions.labelDetailOptions.labelMenuMakeModel) 
	  		calloutLbl.innerHTML  = asset.makeModelToDisplay;
	  	if(map.vlMapOptions.labelDetailOptions.labelMenuMileage && vss.common.EnumMeterLabelPreferenceType.showMileage(map.vlMapOptions.meterLabelPreference))
	  		calloutLbl.innerHTML  = asset.mileageToDisplay;
	  	if(map.vlMapOptions.labelDetailOptions.labelMenuNumberOfAlerts)
			calloutLbl.innerHTML  = asset.numberOfAlertsDisplay;
   };