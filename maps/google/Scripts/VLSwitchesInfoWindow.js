'use strict';

var vss = window.vss || {};
vss.controls = vss.controls || {};
(function(infoWindow,undefined){
infoWindow.SwitchesInfoWindow =  function(){
	this.infoBox = null;
	this.assetData = null;	
};
infoWindow.SwitchesInfoWindow.prototype = function()
{
	var createSwitchesInfoWindow = function(map, asset){		
		if(this.infoBox != null)
		{
			this.infoBox.close();
			this.infoBox = null;
		}		
		this.assetData = asset;					
		var contentDiv = $('<div/>').addClass('switchesContent');
		
		var topContentDiv = $('<div/>').addClass('switchesTopContent').text(asset.dateTimeForMapDisplay);
		contentDiv.append(topContentDiv);
		
		var bottomContentDiv = $('<div/>').addClass('switchesBottomContent');
		contentDiv.append(bottomContentDiv);
		var bottomContentDivTable = $('<table></table>').addClass('switchesInfoWindow infoWindowKeyValuePairs');
		bottomContentDiv.append(bottomContentDivTable);
		
		var bottomContentDivTableStateRow = $('<tr></tr>').appendTo(bottomContentDivTable);
		var stateTd = $('<td></td>').addClass('switchesTdAlign switchesTdLeft').appendTo(bottomContentDivTableStateRow).text(getString('state') + ": ");   	
		var stateTdValue = $('<td></td>').appendTo(bottomContentDivTableStateRow).addClass('switchesTdAlign switchesTdRight').text((asset.displayState === null || asset.displayState === "") ? "-" : asset.displayState );
	   
	    var bottomContentDivTableDescriptionRow = $('<tr></tr>').appendTo(bottomContentDivTable);
	    var descriptionTd = $('<td></td>').addClass('switchesTdAlign switchesTdLeft').appendTo(bottomContentDivTableDescriptionRow).text(getString('description') + ": ");   	
	    var descriptionTdValue = $('<td></td>').appendTo(bottomContentDivTableDescriptionRow).addClass('switchesTdAlign switchesTdRight');
      	this.descriptionTd = descriptionTdValue;      		
        descriptionTdValue.text((asset.displaysDescription === null || asset.displaysDescription === "") ? "-" : asset.displaysDescription);
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
		createSwitchesInfoWindow:createSwitchesInfoWindow,
		closeExistingInfoWindow:closeExistingInfoWindow
	};
}();
})(vss.controls);