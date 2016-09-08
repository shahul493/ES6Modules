'use strict';

var vss = window.vss || {};
vss.controls = vss.controls || {};
(function(infoWindow,undefined){
infoWindow.HoursLocationInfoWindow =  function(){
	this.infoBox = null;
	this.assetData = null;
	this.LocationTd = null;
};
infoWindow.HoursLocationInfoWindow.prototype = function()
{

	var createInfoWindow = function(map,asset){
		if(this.infoBox != null)
		{
			this.infoBox.close();
			this.infoBox = null;
		}
		var isHoursSelected = false;
		var isMileageSelected = false;
		this.assetData = asset;
		var contentDiv = $('<div/>').addClass('hoursLocationContent');
		var topContentDiv = $('<div/>').addClass('hoursLocationTopContent').text(asset.EventTimeStampToDisplay);
		contentDiv.append(topContentDiv);
		var bottomContentDiv = $('<div/>').addClass('hoursLocationBottomContent');
		contentDiv.append(bottomContentDiv);
		var bottomContentDivTable = $('<table></table>').addClass('hoursLocationInfoWindow infoWindowKeyValuePairs');
		bottomContentDiv.append(bottomContentDivTable);
		if(vss.common.EnumMeterLabelPreferenceType.showHourMeter(map.vlMapOptions.meterLabelPreference))
		{
			isHoursSelected = true;
			var bottomContentDivTableHoursRow = $('<tr></tr>').appendTo(bottomContentDivTable);
		    var hoursTd = $('<td></td>').addClass('hoursLocationTdAlign hoursLocationTdRight').appendTo(bottomContentDivTableHoursRow).text(getString('hours') + ": ");   	
		    var hoursTdValue = $('<td></td>').appendTo(bottomContentDivTableHoursRow).addClass('hoursLocationTdAlign').text(asset.runtimeHoursToDisplay);
		    hoursTdValue.css('font-weight','bold');
	    }
	    if(vss.common.EnumMeterLabelPreferenceType.showMileage(map.vlMapOptions.meterLabelPreference))
	    {
	    	isMileageSelected = true;
			var bottomContentDivTableMileageRow = $('<tr></tr>').appendTo(bottomContentDivTable);
		    var mileageTd = $('<td></td>').addClass('hoursLocationTdAlign hoursLocationTdRight').appendTo(bottomContentDivTableMileageRow).text(getString('mileage') + ": ");   	
		    var mileageTdValue = $('<td></td>').appendTo(bottomContentDivTableMileageRow).addClass('hoursLocationTdAlign').text(asset.odometerMilesToDisplay);
		    mileageTdValue.css('font-weight','bold');
	    }
	    var bottomContentDivTableLocationRow = $('<tr></tr>').appendTo(bottomContentDivTable);
	    var locationTd = $('<td></td>').addClass('hoursLocationTdAlign hoursLocationTdRight').appendTo(bottomContentDivTableLocationRow).text(getString('location') + ": ");   	
	    var locationTdValue = $('<td></td>').appendTo(bottomContentDivTableLocationRow).addClass('hoursLocationTdAlign');
      	this.LocationTd = locationTdValue;
      	if(asset.location == null || asset.location == "")
      	{
      			var address = getReverseGeoAddress(asset.latitude,asset.longitude);
				locationTdValue.text(address);
				asset.location = address;
      	}
      	else
      		locationTdValue.text(asset.location);
      	locationTdValue.css('font-weight','bold');
	      	
	       var contentHtmlDiv = $("<div/>");
	       contentHtmlDiv.append(contentDiv);
			
	          this.infoBox = new google.maps.InfoWindow({
	          	content: contentHtmlDiv.get(0),
	            position: new google.maps.LatLng(asset.latitude,asset.longitude),
	           	pixelOffset: new google.maps.Size(0, 0),
	           	zIndex: 1
	          });
			  google.maps.event.addListener(this.infoBox,'closeclick',function(){
			  	removeGridSelection();
			});
	          this.infoBox.open(map);
    },
	closeExistingInfoWindow = function()
	{
		if(this.infoBox != null)
		{
			this.infoBox.close();
			this.infoBox = null;
		}
	}
	return{
		createInfoWindow:createInfoWindow,
		closeExistingInfoWindow:closeExistingInfoWindow
	};
}();
})(vss.controls);