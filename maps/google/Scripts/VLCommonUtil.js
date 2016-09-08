'use strict';
var util = { 
mapToolMenuSelections:{
  isMeasureTool:false,
  isAreaTool:false,
  isProductionDataTool:true,
  isAssetsTool:true,
  isCellDetailsTool:false,
  isFillTool:true,
  coordsSelection:constants.NoCoords},
	addEvent:function(el, type, fn){
		if(typeof addEventListener !== "undefined") {
			el.addEventListener(type, fn, false);
		}else if(typeof attachEvent !== "undefined") {
			el.attachEvent("on"+type, fn);
		}else {
			el["on" + type] = fn;
		}
	},
	getTarget:function(event){
		if(typeof event.target !== "undefined"){
			return event.target;
		}else{
			return event.srcElement;
		}
	},
	createControlEle:function(eleType,eleId,eleClassName,srcImg){
		var ele = document.createElement(eleType);
		ele.id = eleId;
		ele.className = eleClassName;
		if(eleType == 'img')
			ele.src = srcImg;

			return ele;
	},
	createInputEle:function(eletype,eleId,eleClassName){
		var inputEle = document.createElement("input");
		inputEle.setAttribute('type',eletype);
		inputEle.id = eleId;
		inputEle.className = eleClassName;

		return inputEle;
	}, 
	addMenuItem:function(type,parent_node, listLabel, groupname, data, toggled, indentation)
		{
			if(type == constants.SEPARATOR)
			{
				var divEle = document.createElement("div");
				divEle.className = "hr";
				parent_node.appendChild(divEle);
			}
			else if(type == constants.NORMAL)
			{
				var labelEle = document.createElement("span");
				labelEle.innerHTML = listLabel;
				labelEle.className = "displayMenuLabel";
				parent_node.appendChild(labelEle);

			}
			else if(type == constants.NAV_LABEL)
			{
				var liEle = document.createElement("li");
				var labelEle = document.createElement("label");
				labelEle.innerHTML = listLabel;
				labelEle.className = "arrowIcon";
				liEle.appendChild(labelEle);
			  parent_node.appendChild(liEle);
				util.indentMenuItem(liEle,indentation);
			  return liEle;

			}else if(type == constants.RADIO || type == constants.CHECK )
			{
				var liEle = util.createMenuInputElement(type,parent_node,listLabel,groupname,data,toggled);
				util.indentMenuItem(liEle,indentation);
			}

	},
	createMenuInputElement:function(type,parent_node,listLabel,groupname,data,toggled)
		{
		var liEle = document.createElement("li");

			var inputEle = document.createElement("input");
			inputEle.id = data;
			inputEle.checked = toggled;
			inputEle.setAttribute('type',type);
			inputEle.setAttribute('name',groupname);
			inputEle.setAttribute('data',data);
			liEle.appendChild(inputEle);

			var labelEle = document.createElement("label");
			labelEle.appendChild(document.createTextNode(listLabel));					
			labelEle.setAttribute('for',inputEle.id);
			
			// for IE specifically set style selector
			if (window.attachEvent && !window.addEventListener && toggled) {
				labelEle.className = type == constants.RADIO ? "checked":"checkBoxChecked";
			}
			liEle.appendChild(labelEle);
			parent_node.appendChild(liEle);
			return liEle;
	},
 	indentMenuItem:function(liEle,indentation){
		if (indentation > 0){
			liEle.className = (liEle.className == '' ? '' : liEle.className + ' ') + 'indent' + indentation;
		}
	},
	ieInputSelectionHandlerCheck:function (target){
		var sibInput = target[0].previousSibling;
		var targetLabel = target[0];

			if(sibInput.type == "radio" ){
				if(sibInput.name == constants.MAP_TYPE){
					$("ul#navmenu li > label").removeClass("checked");
					targetLabel.className = "checked";
					sibInput.checked = true;
				}
				if(sibInput.name == constants.COORDS_MENU){
					$("ul.sub1 li > label").removeClass("checked");
					targetLabel.className = "checked";
					sibInput.checked = true;
				}
				if(sibInput.name == constants.LABEL_MENU){
					$("ul.sub2 li > label").removeClass("checked");
					targetLabel.className = "checked";
					sibInput.checked = true;
				}
				
			}

			if(sibInput.type == "checkbox" ){
					if(targetLabel.className == "checkBoxChecked")
					{
						target.removeClass("checkBoxChecked");
						sibInput.checked = false;
					}
					else
					{
						targetLabel.className = "checkBoxChecked";
						sibInput.checked = true;
					}					 
			};
	},
	createMapTypes:function(mainUL,mapType){
		util.addMenuItem(constants.RADIO, mainUL, getString("map"), constants.MAP_TYPE, vss.common.EnumMapType.MAP, mapType == vss.common.EnumMapType.MAP);
		util.addMenuItem(constants.RADIO, mainUL, getString("satellite"), constants.MAP_TYPE, vss.common.EnumMapType.SATELLITE, mapType == vss.common.EnumMapType.SATELLITE);
		util.addMenuItem(constants.RADIO, mainUL, getString("hybrid"), constants.MAP_TYPE, vss.common.EnumMapType.HYBRID, mapType == vss.common.EnumMapType.HYBRID );
		util.addMenuItem(constants.RADIO, mainUL, getString("terrain"), constants.MAP_TYPE, vss.common.EnumMapType.TERRAIN, mapType == vss.common.EnumMapType.TERRAIN ); 
	},
	createAllAssets:function(mainUL, allAssetSelected){
		util.addMenuItem(constants.NORMAL,mainUL,getString("display"));
		util.addMenuItem(constants.CHECK, mainUL, getString("allAssets"), constants.ALL_ASSETS, "AllAssets", allAssetSelected, 1); 
	},
	createLabel:function(mainUL,labelUL,detailUL,labelDetailOptions,assetLabelPreference,hourLabelPreference){
		var labelSubMenu = util.addMenuItem(constants.NAV_LABEL,mainUL,getString("label"));
			labelSubMenu.appendChild(labelUL);
				util.addMenuItem(constants.RADIO, labelUL, getString("none"), constants.LABEL_MENU, "labelMenuNone", labelDetailOptions.labelMenuNone );
				util.addMenuItem(constants.SEPARATOR,labelUL);
				if(vss.common.EnumAssetLabelPreferenceType.showAssetID(assetLabelPreference))
				{	
					util.addMenuItem(constants.RADIO, labelUL, getString("assetID"), constants.LABEL_MENU, "labelMenuAssetID", labelDetailOptions.labelMenuAssetID );
				}
				if(vss.common.EnumAssetLabelPreferenceType.showSerialNumber(assetLabelPreference))
				{
					util.addMenuItem(constants.RADIO, labelUL, getString("sn"), constants.LABEL_MENU, "labelMenuSerialNumber", labelDetailOptions.labelMenuSerialNumber );
				}
				util.addMenuItem(constants.RADIO, labelUL, getString("vin"), constants.LABEL_MENU, "labelMenuVIN", labelDetailOptions.labelMenuVIN );
				util.addMenuItem(constants.RADIO, labelUL, getString("dateLastReported"), constants.LABEL_MENU, "labelMenuDateLastReported", labelDetailOptions.labelMenuDateLastReported );
				util.addMenuItem(constants.RADIO, labelUL, getString("fuelPercentRemaining"), constants.LABEL_MENU, "labelMenuFuelPercentRemaining", labelDetailOptions.labelMenuFuelPercentRemaining );				
				if(vss.common.EnumMeterLabelPreferenceType.showHourMeter(hourLabelPreference))
				{
					util.addMenuItem(constants.RADIO, labelUL, getString("hours"), constants.LABEL_MENU, "labelMenuHours", labelDetailOptions.labelMenuHours );
				}
				if(vss.common.EnumMeterLabelPreferenceType.showMileage(hourLabelPreference))
				{
					util.addMenuItem(constants.RADIO, labelUL, getString("odometer"), constants.LABEL_MENU, "labelMenuMileage", labelDetailOptions.labelMenuMileage );
				}
				util.addMenuItem(constants.RADIO, labelUL, getString("lastKnownStatus"), constants.LABEL_MENU, "labelMenuLastKnownState", labelDetailOptions.labelMenuLastKnownState );
				util.addMenuItem(constants.RADIO, labelUL, getString("location"), constants.LABEL_MENU, "labelMenuLocation", labelDetailOptions.labelMenuLocation );
				util.addMenuItem(constants.RADIO, labelUL, getString("makeModel"), constants.LABEL_MENU, "labelMenuMakeModel", labelDetailOptions.labelMenuMakeModel );
				util.addMenuItem(constants.RADIO, labelUL, getString("openAlerts"), constants.LABEL_MENU, "labelMenuNumberOfAlerts", labelDetailOptions.labelMenuNumberOfAlerts );

	},
	createDetails:function(mainUL,labelUL,detailUL,labelDetailOptions,showDesign,assetLabelPreference,hourLabelPreference){
	var detailSubMenu = util.addMenuItem(constants.NAV_LABEL,mainUL,getString("details"));
		detailSubMenu.appendChild(detailUL);
			if(map.vlMapOptions.labelDetailOptions.detailsMenuAssetID &&  vss.common.EnumAssetLabelPreferenceType.Both == map.vlMapOptions.assetLabelPreference)
			{
				util.addMenuItem(constants.CHECK, detailUL, getString("assetID"), constants.DETAILS_MENU, "detailsMenuAssetID", labelDetailOptions.detailsMenuAssetID );
			}
			util.addMenuItem(constants.CHECK, detailUL, getString("vin"), constants.DETAILS_MENU, "detailsMenuVIN", labelDetailOptions.detailsMenuVIN );
			util.addMenuItem(constants.CHECK, detailUL, getString("dateLastReported"), constants.DETAILS_MENU, "detailsMenuDateLastReported", labelDetailOptions.detailsMenuDateLastReported );
			util.addMenuItem(constants.CHECK, detailUL, getString("fuelPercentRemaining"), constants.DETAILS_MENU, "detailsMenuFuelPercentRemaining", labelDetailOptions.detailsMenuFuelPercentRemaining );
			if(vss.common.EnumMeterLabelPreferenceType.showHourMeter(hourLabelPreference))
			{
				util.addMenuItem(constants.CHECK, detailUL, getString("hours"), constants.DETAILS_MENU, "detailsMenuHours", labelDetailOptions.detailsMenuHours );
			}
			if(vss.common.EnumMeterLabelPreferenceType.showMileage(hourLabelPreference))
			{						
				util.addMenuItem(constants.CHECK, detailUL, getString("odometer"), constants.DETAILS_MENU, "detailsMenuMileage", labelDetailOptions.detailsMenuMileage );
			}
			util.addMenuItem(constants.CHECK, detailUL, getString("lastKnownStatus"), constants.DETAILS_MENU, "detailsMenuLastKnownState", labelDetailOptions.detailsMenuLastKnownState );
			util.addMenuItem(constants.CHECK, detailUL, getString("location"), constants.DETAILS_MENU, "detailsMenuLocation", labelDetailOptions.detailsMenuLocation );
			util.addMenuItem(constants.CHECK, detailUL, getString("makeModel"), constants.DETAILS_MENU, "detailsMenuMakeModel", labelDetailOptions.detailsMenuMakeModel );
			util.addMenuItem(constants.CHECK, detailUL, getString("openAlerts"), constants.DETAILS_MENU, "detailsMenuNumberOfAlerts", labelDetailOptions.detailsMenuNumberOfAlerts );

	if(showDesign)
		util.addMenuItem(constants.CHECK, detailUL, getString("design"), constants.DETAILS_MENU, "detailsMenuDesign", labelDetailOptions.detailsMenuDesign);
	},
	createNavInfoMapType:function(mainUL){
		util.addMenuItem(constants.RADIO, mainUL, getString("navInfoMap"), constants.MAP_TYPE, vss.common.EnumMapType.NAV_INFO_MAP, true );
	},
	createMapTools:function(mainUL,coordUL,selectedMapToolItems){
	util.addMenuItem(constants.NORMAL,mainUL,getString("display"));
		var coordSubMenu = util.addMenuItem(constants.NAV_LABEL,mainUL,getString("coordinates"), null, null, null, 1);
			coordSubMenu.appendChild(coordUL);
			util.addMenuItem(constants.RADIO, coordUL, getString("none"), constants.COORDS_MENU, constants.NoCoords, selectedMapToolItems.coordsSelection == constants.NoCoords );
			util.addMenuItem(constants.SEPARATOR,coordUL);
			util.addMenuItem(constants.RADIO, coordUL, getString("latLong"), constants.COORDS_MENU, constants.LatLong, selectedMapToolItems.coordsSelection == constants.LatLong );
			util.addMenuItem(constants.RADIO, coordUL, getString("degreesMinutesSeconds"), constants.COORDS_MENU, constants.DMS, selectedMapToolItems.coordsSelection == constants.DMS );
			util.addMenuItem(constants.RADIO, coordUL, getString("northingEasting"), constants.COORDS_MENU, constants.NE, selectedMapToolItems.coordsSelection == constants.NE );
	util.addMenuItem(constants.CHECK, mainUL, getString("assets"), constants.MAP_TOOLS, constants.ASSETS_TOOL, selectedMapToolItems.isAssetsTool, 1);
	util.addMenuItem(constants.CHECK, mainUL, getString("productionData"), constants.MAP_TOOLS, constants.PRODUCTION_DATA_TOOL, selectedMapToolItems.isProductionDataTool, 1);
	util.addMenuItem(constants.CHECK, mainUL, getString("cellDetails"), constants.MAP_TOOLS, constants.CELL_DETAILS_TOOL, selectedMapToolItems.isCellDetailsTool, 2);
	util.addMenuItem(constants.CHECK, mainUL, getString("measureTool"), constants.MAP_TOOLS, constants.MEASURE_TOOL, selectedMapToolItems.isMeasureTool, 1);
	util.addMenuItem(constants.CHECK, mainUL, getString("areaTool"), constants.MAP_TOOLS, constants.AREA_TOOL, selectedMapToolItems.isAreaTool, 1);
}, createSiteFill:function(mainUL,selectedMapToolItems){
	util.addMenuItem(constants.NORMAL,mainUL,getString("site"));
	util.addMenuItem(constants.CHECK, mainUL, getString("fill"), constants.MAP_TOOLS, constants.FILL_TOOL, selectedMapToolItems.isFillTool, 1);
	},
	switchMapType:function(map,val){
	     map.setMapTypeId(vss.common.EnumMapType.getGoogleMapType(val));
	},
	sortBy:function(key, reverse){
	    var moveSmaller = reverse ? 1 : -1;       
        var moveLarger = reverse ? -1 : 1;        
        
        return function (a, b) {
          if (a[key] < b[key]) {
            return moveSmaller;
          }
          if (a[key] > b[key]) {
            return moveLarger;
          }
          return 0;
        };
	},
	formatString:function() {
	  var s = arguments[0];
	  for (var i = 0; i < arguments.length - 1; i++) {       
	    var reg = new RegExp("\\{" + i + "\\}", "gm");             
	    s = s.replace(reg, arguments[i + 1]);
	  }
	  return s;
	},
	intToRGB:function(i) {

   		 return ("#" + 
           ((i >> 20) & 0x0F).toString(16) +
           ((i >> 16) & 0x0F).toString(16) +
           ((i >> 12) & 0x0F).toString(16) +
           ((i >> 8) & 0x0F).toString(16) +
           ((i >> 4) & 0x0F).toString(16) + 
           (i & 0x0F).toString(16)).toUpperCase();
     },
     shallowCopy:function(oldObj) {
	    var newObj = {};
	    for(var i in oldObj) {
	        if(oldObj.hasOwnProperty(i)) {
	            newObj[i] = oldObj[i];
	        }
	    }
	    return newObj;
	 },
	     
    parseJson:function(args){    
    	var str=args[0].replace(/%5C/g, '\\');	
		var jsonData= JSON.parse(str);
		return jsonData;
	},
	 doReverseGeoCode:function(lat, lng,callBack) {
	    var geocoder = new google.maps.Geocoder();
	    var latlng = new google.maps.LatLng(lat, lng);
	    geocoder.geocode( { 'latLng': latlng }, function (results, status) 
											    {
											    	var retVal;
											        if (status == google.maps.GeocoderStatus.OK) 
											        {
											            if (results[0]) 
											            {
											              retVal =  results[0].formatted_address;
											            }
											            else 
											            {
											                retVal =  "-";
											            }
											        }
											        else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) 
											        {
											            retVal =  "-";
											        }
											        else 
											        {
											           retVal =  "-";
											        }
											        return callBack(retVal);
											    }
						);
	
	}
}
