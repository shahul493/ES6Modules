'use strict';

var vss = window.vss || {};
vss.controls = vss.controls || {};
var previousImage_clone = 0;
(function(ns,undefined){
ns.MapInfoWindow =  function(isPrjMap){
	this.infoBox = null;
	this.assetData = null;
	this.isProjectMap = isPrjMap;
	this.locationContainer = null;
};
ns.MapInfoWindow.prototype = function()
{
	var createInfoWindow = function(map,asset){
	
		var imgPathForLogo =  null;

		var isLtcmTheme = function () {
		    var qs = window.parent.location.search.substring(1).split('&');
		    for (var i = 0; i < qs.length; i++) {
		        if (qs[i].toUpperCase() == 'T=A3487206-F82A-E511-80E0-005056882666') {
		            return true;
		        }
		    }
		    return false;
		};
        var isLtcmSupportedModel = function (make) {
		    var ltcmModelArray = ['PC130-7', 'PC300LC-7', 'PC450LC-7', 'WL-9020'];

		    for (var m in ltcmModelArray) {
		        if (make.search(ltcmModelArray[m]) != -1)
		            return true;
		    }
		    return false;
		};


		var isLogoHeader = false;
		this.assetData = asset;
				if (asset.makeModel != null && asset.makeModel != "")
				{
					var make = asset.makeModel.toUpperCase(); 
					var params = make.split(" ", 2);
					if (params[0].toString() == "CAT")
					{
						imgPathForLogo = 'images/icon-cat_logo-infowindow.png';
					} 
					else if ((make.indexOf("CAT", 0) == 0) || (make.search("CAT") == 0))
					{
						imgPathForLogo = 'images/icon-cat_logo-infowindow.png';
					}
					else if ((make.indexOf("TATA HITACHI", 0) == 0) || (make.search("TATA HITACHI") == 0))
					{
						imgPathForLogo = 'images/tata_hitach.png';
						isLogoHeader = true;
					}
					else if ((params[0].toString() == "LEEBOY") || (make.indexOf("LEEBOY", 0) == 0) || (make.search("LEEBOY") == 0))
					{
						imgPathForLogo = 'images/leeboy_windowinfo.png';
						isLogoHeader = true;
					}
					else if (params[0].toString() == "VER")
					{
						imgPathForLogo = 'images/Vermeer_logo_large.png';
					} 
					else if ((make.indexOf("VER", 0) == 0) )
					{
						imgPathForLogo = 'images/Vermeer_logo_large.png';
					}
					else if ((make.indexOf("NEW HOLLAND", 0) == 0) || params[0].toString() == "NEW" || (make.search("NEW HOLLAND") == 0))
					{
						imgPathForLogo = 'images/NH_logo.png';
						isLogoHeader = true;
					}
					else if ((make.indexOf("CASE", 0) == 0) || params[0].toString() == "CASE" || (make.search("CASE") == 0))
					{
						imgPathForLogo = 'images/CASE_logo.png';
						isLogoHeader = true;
					}
					else if ((make.indexOf("DOOSAN", 0) == 0) || params[0].toString() == "DOOSAN" || (make.search("DOOSAN") == 0))
					{
						imgPathForLogo = 'images/Doosan_logo.png';
						isLogoHeader = true;
					}
					else if (isLtcmTheme() && isLtcmSupportedModel(make)) {
					    imgPathForLogo = 'images/Ltcm_logo.png';
					    isLogoHeader = true;
					}
					else if ((make.indexOf("L&T", 0) == 0) || params[0].toString() == "L&T" || (make.search("L&T") == 0)) {
					    imgPathForLogo = 'images/Ltcel_logo.png';
					    isLogoHeader = true;
					}
					else if ((make.indexOf("LIUGONG", 0) == 0) || params[0].toString() == "LIUGONG" || (make.search("LIUGONG") == 0)) {
					    imgPathForLogo = 'images/LiuGong_logo.png';
					    isLogoHeader = true;
					}
				}
				else
					imgPathForLogo = "";
				
  		if(this.infoBox !=null) 
    	{
    		this.infoBox.close();
    		this.infoBox = null;
    	}
    	
    	
        var contentDiv = $('<div/>').addClass('infowindowContainer');
        if(isLogoHeader == true)
    	{
    		contentDiv.addClass('infowindowContainerWithLogo');
    		var logoCntent = $("<div/>").appendTo(contentDiv).addClass('infoWindowContentLogoHeader');
	        logoCntent.css('background-image', 'url(' + imgPathForLogo + ')');
	        if(map.vlMapOptions.themeColor != null)
	        {
	        	logoCntent.css('background-color',util.intToRGB(map.vlMapOptions.themeColor.primary));
	        }
	        else
	        	logoCntent.css('background-color','#040b50');
	    }
        var assetImageContent = $("<div/>").addClass('infoWindowAssetNameContainer');
        
      	var assetImageContentDataTable = $("<table></table>");
      	assetImageContentDataTable.css('width',"300px");
      	assetImageContentDataTable.css('border','0px');
      	assetImageContentDataTable.attr('cellspacing','3');
      	assetImageContentDataTable.attr('cellpadding','0');
      	
      	var tableRow = $("<tr></tr>");
      	
      	
      	if(!isLogoHeader && imgPathForLogo != "" && imgPathForLogo!= null)
      	{
	      	var logoTableData = $("<td></td>");
	      	logoTableData.css('width','55px');
	      	logoTableData.css('align','left');
	      	logoTableData.css('padding-left','10px');
	      	logoTableData.append('<img src="' + imgPathForLogo + '"/>')
	      	tableRow.append(logoTableData);
      	}
      	
      	var iconTableData = $("<td></td>");
      	iconTableData.css('width','55px');
      	iconTableData.css('align','left');
      	iconTableData.css('padding-left','5px');
      	iconTableData.append('<img src="data:image/jpeg;base64,' + getAssetIcon(asset.assetIconID) + '"/>');
      	
      	var assetNameTableData = $("<td></td>");
      	var assetNameTableDataDiv = $("<span/>").addClass('clickableDiv').appendTo(assetNameTableData);
      	assetNameTableDataDiv.css('align','left');
      	
      	 if(map.vlMapOptions.themeColor != null)
	        {
	        	assetNameTableDataDiv.css('color',util.intToRGB(map.vlMapOptions.themeColor.notable));
	        }
	        else
	        	assetNameTableDataDiv.css('color','#050c51');
	       	
      	
      	assetNameTableDataDiv.text(asset.assetNameToDisplay);
      	
      	assetNameTableDataDiv.click(function(){
			          	openAssetDetailsFromMap(asset.assetID, "DASHBOARD");
			          });
		
		tableRow.append(iconTableData);
      	tableRow.append(assetNameTableData);
      	
      	assetImageContentDataTable.append(tableRow)
        assetImageContent.append(assetImageContentDataTable);
        contentDiv.append(assetImageContent);
        
        
       var dataContentDiv = $("<div/>").addClass('infowindowBottomContainer infowindowBottomContainerNoScroll');
         
        
        var dataContentDivTable = $("<table></table>");
      	dataContentDivTable.css('border','0px');
      	dataContentDivTable.attr('cellspacing','3');
      	dataContentDivTable.attr('cellpadding','0');
      	
      	
      	if(map.vlMapOptions.labelDetailOptions.detailsMenuAssetID &&  vss.common.EnumAssetLabelPreferenceType.Both == map.vlMapOptions.assetLabelPreference )
          	 {
          	 	var dataTableAssetNameRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableAssetNameTextTD = $('<td></td>').appendTo(dataTableAssetNameRow).addClass('bottomContainerText');
          		dataTableAssetNameTextTD.css('width', "145px");
          		dataTableAssetNameTextTD.text(getString("assetID") + " : ");
          		var dataTableAssetNameDataTD = $('<td></td>').appendTo(dataTableAssetNameRow).addClass('bottomContainerValue');
          		dataTableAssetNameDataTD.css('width', "170px");
          		if(asset.assetName ==  null || asset.assetName == "")
          			dataTableAssetNameDataTD.text("-");
          		else	
          			dataTableAssetNameDataTD.text(asset.assetName);
          		
          	 }
          	 if(map.vlMapOptions.labelDetailOptions.detailsMenuDateLastReported == true)
	      	{
		      	var dataTableDateLastReportedRow = $('<tr></tr>').appendTo(dataContentDivTable);
		      	
		      	 var dataTableDateLastReportedTextTD = $('<td></td>').appendTo(dataTableDateLastReportedRow).addClass('bottomContainerText');
                dataTableDateLastReportedTextTD.css('width',"145px");
                dataTableDateLastReportedTextTD.text(getString("dateLastReported") +  " : ");
                var dataTableDateLastReportedDataTD = $('<td></td>').appendTo(dataTableDateLastReportedRow).addClass('bottomContainerValue');
                dataTableDateLastReportedDataTD.css('width',"170px");
                dataTableDateLastReportedDataTD.text(asset.lastReportUTCDisplay);
                
	      	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuVIN)
          	{
          		var dataTableVINRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableVINTextTD = $('<td></td>').appendTo(dataTableVINRow).addClass('bottomContainerText');
          		dataTableVINTextTD.css('width',"145px");
          		dataTableVINTextTD.text(getString("vin") + " : ");
          		var dataTableVINDataTD = $('<td></td>').appendTo(dataTableVINRow).addClass('bottomContainerValue');
          		dataTableVINDataTD.css('width',"170px");
          		dataTableVINDataTD.text(asset.vinToDisplay);
          		
          	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuHours && vss.common.EnumMeterLabelPreferenceType.showHourMeter(map.vlMapOptions.meterLabelPreference))
          	{
          		var dataTableHoursRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableHoursTextTD = $('<td></td>').appendTo(dataTableHoursRow).addClass('bottomContainerText');
          		dataTableHoursTextTD.css('width',"145px");
          		dataTableHoursTextTD.text(getString("hours") +  " : ");
          		var dataTableHoursDataTD = $('<td></td>').appendTo(dataTableHoursRow).addClass('bottomContainerValue');
          		dataTableHoursDataTD.css('width',"170px");
          		dataTableHoursDataTD.text(asset.runtimeHoursDisplay);
          		
          	} 
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuFuelPercentRemaining)
          	{
          		var dataTableFuelRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableFuelTextTD = $('<td></td>').appendTo(dataTableFuelRow).addClass('bottomContainerText');
          		dataTableFuelTextTD.css('width',"145px");
          		dataTableFuelTextTD.text(getString("fuelPercentRemaining") +  " : ");
          		var dataTableFuelDataTD = $('<td></td>').appendTo(dataTableFuelRow).addClass('bottomContainerValue');
          		dataTableFuelDataTD.css('width',"170px");
          		dataTableFuelDataTD.text(asset.fuelPercentRemainingToDisplay);
          		
          	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuLocation)	
          	{
          
          		var dataTablelocationRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTablelocationTextTD = $('<td></td>').appendTo(dataTablelocationRow).addClass('bottomContainerText');
          		dataTablelocationTextTD.css('width',"145px");
          		dataTablelocationTextTD.text(getString("location") +  " : ");
          		var dataTablelocationDataTD = $('<td></td>').appendTo(dataTablelocationRow).addClass('bottomContainerLocationValue');
          		dataTablelocationDataTD.css('width',"170px");
          		dataTablelocationDataTD.css('padding-right',"20px");
          		this.locationContainer = dataTablelocationDataTD;
          		if(asset.location == null || asset.location == "")
          		{
          				var address = getReverseGeoAddress(asset.latitude,asset.longitude);
						dataTablelocationDataTD.text(address);
						asset.location = address;
          		}
          		else
          			dataTablelocationDataTD.text(asset.location);
          	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuLastKnownState)
          	{
          		var dataTableLKSRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableLKSTextTD = $('<td></td>').appendTo(dataTableLKSRow).addClass('bottomContainerText');
          		dataTableLKSTextTD.css('width',"145px");
          		dataTableLKSTextTD.text(getString('lastKnownStatus')+ " :");
          		var dataTableLKSDataTD = $('<td></td>').appendTo(dataTableLKSRow).addClass('bottomContainerValue');
          		dataTableLKSDataTD.css('width',"170px");
          		dataTableLKSDataTD.text(asset.lastStateIDDisplay);
          	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuMakeModel) 
          	{
          		var dataTableMMRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableMMTextTD = $('<td></td>').appendTo(dataTableMMRow).addClass('bottomContainerText');
          		dataTableMMTextTD.css('width',"145px");
          		dataTableMMTextTD.text(getString("makeModel") +  " : ");
          		var dataTableMMDataTD = $('<td></td>').appendTo(dataTableMMRow).addClass('bottomContainerValue');
          		dataTableMMDataTD.css('width',"170px");
          		dataTableMMDataTD.text(asset.makeModelToDisplay);
          		
          	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuMileage && vss.common.EnumMeterLabelPreferenceType.showMileage(map.vlMapOptions.meterLabelPreference))
          	{
          		var dataTableMileageRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableMileageTextTD = $('<td></td>').appendTo(dataTableMileageRow).addClass('bottomContainerText');
          		dataTableMileageTextTD.css('width',"145px");
          		dataTableMileageTextTD.text(getString("odometer") +  " : ");
          		var dataTableMileageDataTD = $('<td></td>').appendTo(dataTableMileageRow).addClass('bottomContainerValue');
          		dataTableMileageDataTD.css('width',"170px");
          		dataTableMileageDataTD.text(asset.mileageToDisplay);
          	}
          	if(map.vlMapOptions.labelDetailOptions.detailsMenuNumberOfAlerts)
			{
				var dataTableAlertsRow = $('<tr></tr>').appendTo(dataContentDivTable);
          		var dataTableAlertsTextTD = $('<td></td>').appendTo(dataTableAlertsRow).addClass('bottomContainerText');
          		dataTableAlertsTextTD.css('width',"145px");
          		dataTableAlertsTextTD.text(getString("openAlerts") +  " : ");
          		var dataTableAlertsDataTD = $('<td></td>');
          		var dataTableAlertsDataTDDiv =$('<span/>').click(function(){
			          	openAssetDetailsFromMap(asset.assetID, "ALERTS");
			          }).appendTo(dataTableAlertsDataTD).addClass('clickableDiv');
			   	dataTableAlertsDataTD.appendTo(dataTableAlertsRow).addClass('bottomContainerValue');
          		dataTableAlertsDataTDDiv.text(asset.numberOfAlertsDisplay);
          		dataTableAlertsDataTDDiv.css('font-size','1em')
          		dataTableAlertsDataTD.css('width',"170px");
          		if(map.vlMapOptions.themeColor != null)
		        {
		        	dataTableAlertsDataTDDiv.css('color',util.intToRGB(map.vlMapOptions.themeColor.notable));
		        }
		        else
		        {
		        	dataTableAlertsDataTDDiv.css('color','#050c51');
		        }
          	}
			
            if(map.vlMapOptions.labelDetailOptions.detailsMenuDesign && this.isProjectMap)
            {
                var dataTableDesignRow = $('<tr></tr>').appendTo(dataContentDivTable);
                var dataTableDesignTextTD = $('<td></td>').appendTo(dataTableDesignRow).addClass('bottomContainerText');
                dataTableDesignTextTD.css('width',"145px");
                dataTableDesignTextTD.text(getString("design") +  " : ");
                var dataTableDesignDataTD = $('<td></td>').appendTo(dataTableDesignRow).addClass('bottomContainerValue');
                dataTableDesignDataTD.css('width',"170px");
                dataTableDesignDataTD.text(asset.designNameToDisplay);
            }
            
      				
			
			
      	assetImageContent.append(assetImageContentDataTable);
        contentDiv.append(assetImageContent);
       	dataContentDiv.append(dataContentDivTable);
        contentDiv.append(dataContentDiv);
        var contentHtmlDiv = $("<div/>");
       	contentHtmlDiv.append(contentDiv);
		
        this.infoBox = new google.maps.InfoWindow({
          	content: contentHtmlDiv.get(0),
            position: new google.maps.LatLng(asset.latitude,asset.longitude),
           	pixelOffset: new google.maps.Size(0, 0),
           	zIndex: 1
          });
          
        
		  google.maps.event.addListener(this.infoBox,'closeclick',(function(that){
		  	return function() { google.maps.event.trigger(that, vss.common.InfoWindowEventType.CLOSE_INFO_WINDOW);};
		})(this));
    
    
        this.infoBox.open(map);
        
        //enlarge the info window to fit the content, eliminating the default scroll bar
        var infoBoxInContext = this.infoBox;
        var resizeInterval = null;
        var resizeFunction = function() {
            if ($('.gm-style-iw').length != 1) {
                return;
            }
            window.clearInterval(resizeInterval);
            window.setTimeout(function() {
                var hasHeader = contentDiv.hasClass('infowindowContainerWithLogo');
                var requiredHeight = dataContentDivTable.height() + 20 + (hasHeader ? 35 : 0);
                contentDiv.css( { 'min-height': requiredHeight + 'px' } );
                window.setTimeout(function() {
                    infoBoxInContext.open(map);
                    window.setTimeout(function() {
                        //if the map height is less than the expanded info box, then google forces a smaller box - detect and reintroduce scroll bar
                        var outerGoogleDivHeight = contentHtmlDiv.parent().parent().height();
                        if (requiredHeight > outerGoogleDivHeight - 34) {
                            dataContentDiv.removeClass('infowindowBottomContainerNoScroll');
                        }
                        var imgElm = $('.gm-style-iw').parent().find('img').last();
                        //replace the close button when there is a blue header
                        if(previousImage_clone == 0){
                       	previousImage_clone = $('.gm-style-iw').parent().find('img').last().clone();
                        }
                        if (hasHeader) {
                            var buttonImg = imgElm;
                            if (buttonImg.length == 1) {
                                buttonImg = buttonImg.get(0);
                                buttonImg.src = 'images/closeInfoWindow.png';
                                buttonImg.style.left = '2px';
                                buttonImg.style.top = '-2px';
                                buttonImg.style.width = '13px';
                                buttonImg.style.height = '13px';
                            }
                        }else{
                          	var buttonImg = imgElm;
                            if (buttonImg.length == 1) {
                                buttonImg = buttonImg.get(0);
                                buttonImg.src = $(previousImage_clone).attr("src");
                                buttonImg.style.left = $(previousImage_clone).css("left");
                                buttonImg.style.top = $(previousImage_clone).css("top");
                                buttonImg.style.width = $(previousImage_clone).css("width");
                                buttonImg.style.height = $(previousImage_clone).css("height");
                            }
                        }
                    }, 0);
                }, 0);
            }, 0);
        }
        resizeInterval = window.setInterval(resizeFunction, 0);
    },
	closeExistingInfoWindow = function()
	{
		if(this.infoBox != null)
		{
			this.infoBox.close();
			this.infoBox = null;
		}
	},
	getSelectedAssetData = function()
	{
		return this.assetData;
	}
	return{
		createInfoWindow:createInfoWindow,
		closeExistingInfoWindow:closeExistingInfoWindow,
		getSelectedAssetData:getSelectedAssetData
	};
}();
})(vss.controls);
