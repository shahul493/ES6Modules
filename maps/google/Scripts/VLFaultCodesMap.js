'use strict';
	var faultObjCollection,   	
    	vlSite,
    	prevSelections,
    	faultInitialListIDs,
    	searchControl,
    	multipleSelectionIDs = [], 
    	lastItemClickedID,
    	maxZIndex;
     
 	function mapInitialized()
    { 
    	google.maps.event.addListener(map, "mousemove", onMouseMove);
  		google.maps.event.addListener(map, "mouseout", onMouseOut); 
		 google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapTypeAndResetMenu);
		 var mapMenuOptions = {};  
		 mapMenuOptions.mapToolMenuSelections = util.mapToolMenuSelections;
		 mapMenuOptions.showMaptype = true;
		 mapMenuOptions.mapTypeChangeFn = mapTypeChange;
		 VLMapInfoControl.MapInfoControl(map,mapMenuOptions);
		 searchControl = new SearchControl(map); 
		 vlSite = new VLSite(map);
		 mapReady();	
 	}
    
    function clearSitePolygons() {
      vlSite.clearSitePolygons(); 
    }
    
    function addSitePolygons(siteList) {          	        
        vlSite.clearSitePolygons();        
        if (siteList.length > 0) { 
           vlSite.addSitePolygons(siteList);
        }
    }
       
      
	function loadFaultLocations(faultList){
	
		//close find control and clear search marker from map
		if(searchControl != null){
			searchControl.resetSearchControl();
		}
		
		if(faultObjCollection != null){
			clearMapItems();
		}
		faultInitialListIDs = [];
		faultObjCollection = [];
		
		if(faultList.length > 0){
			for(var i=0;i<faultList.length;i++){
				var faultObj = faultList[i];
				var myLatLng = new google.maps.LatLng(faultObj.latitude, faultObj.longitude);					
				var faultMarker = new google.maps.Marker({
		    	    position: myLatLng,
		        	map: map,
		        	icon:getSeverityIcon(faultObj.severity,false),
		        	title: faultObj.description,
		        	zIndex: i + 1,
		        	mapItemID:faultObj.exceptionID,
		        	severity:faultObj.severity
		      	});
		      	google.maps.event.addListener(faultMarker,"click",function(){
		      		onMapItemClicked(this);
		      		
		      		});
		      	faultInitialListIDs.push(faultObj.exceptionID);
				faultObjCollection.push(faultMarker);
			}
		}
		
		if(faultObjCollection.length > 0){
			VLMapUtil.setMapCenter(map,faultObjCollection);
		}
	}
	
	function onMapItemClicked(currentMarker){
		if(event.ctrlKey)
		{
			if(event.altKey)
			{
				multipleSelectionIDs.splice(jQuery.inArray(currentMarker.mapItemID,multipleSelectionIDs));
				lastItemClickedID = multipleSelectionIDs[multipleSelectionIDs.length-1];
				selectDeselectMarker(currentMarker, false);
			}else
			{
				lastItemClickedID = currentMarker.mapItemID;							
		 		multipleSelectionIDs.push(currentMarker.mapItemID);
		 		selectDeselectMarker(currentMarker, true);
			}
			
		 	//selectMapItems(multipleSelectionIDs);
		}
		else
		{
			lastItemClickedID = currentMarker.mapItemID;
			for(var i=0;i<multipleSelectionIDs.length;i++)
			{
				var faultMarker = faultObjCollection[jQuery.inArray( multipleSelectionIDs[i], faultInitialListIDs )];
				selectDeselectMarker(faultMarker, false);
			}
						
			multipleSelectionIDs = [];		 	
		 	multipleSelectionIDs.push(currentMarker.mapItemID);
		 	selectDeselectMarker(currentMarker, true);		 	
			//selectMapItems(multipleSelectionIDs);
		}
		
	    onVLFaultMapItemClicked(multipleSelectionIDs.toString());
	}
	
	function getStringList(multipleSelectionIDs){
		var list = "";
        for (var i=0; i<multipleSelectionIDs.length; i++) {
            list += multipleSelectionIDs + ",";         
        }
        //Remove trailing ","
        return list.substr(0, list.length-1); 
	}
	
	function getSeverityIcon(severity,showBorder){
		var severityImg;
		switch (severity)
			{
				case 1:
						severityImg = showBorder?'images/faultBalloonLowSelected.png' : 'images/faultBalloonLow.png';
					break;
				case 2:
						severityImg = showBorder?'images/faultBalloonMedSelected.png' : 'images/faultBalloonMed.png';
					break;
				case 3:
						severityImg = showBorder?'images/faultBalloonHighSelected.png' :'images/faultBalloonHigh.png';
					break;
			}
			
		return new google.maps.MarkerImage(severityImg,
				new google.maps.Size(13, 24),
				new google.maps.Point(0,0),
				new google.maps.Point(6,24));
				
	}
	
	function selectMapItems(mapItemIDsToSelect){
		if(multipleSelectionIDs != null)
		{		
			for(var i=0;i<multipleSelectionIDs.length;i++)
			{
				var itemIndex  = jQuery.inArray(multipleSelectionIDs[i],faultInitialListIDs);
				if(itemIndex != -1)
				{
					selectDeselectMarker(faultObjCollection[itemIndex],false)
				}
				
			}
			multipleSelectionIDs = [];
		}
		if(mapItemIDsToSelect != null)
		{
			multipleSelectionIDs = 	mapItemIDsToSelect;
			for(var i=0;i<mapItemIDsToSelect.length;i++)
			{
				var itemIndex = jQuery.inArray( mapItemIDsToSelect[i], faultInitialListIDs );
				if(itemIndex != -1){
					selectDeselectMarker(faultObjCollection[itemIndex],true);
				}
			}
		}
			
	}
	 
	function selectDeselectMarker(faultMarker,showSelection){
		faultMarker.setIcon(getSeverityIcon(faultMarker.severity,showSelection));
		
		if(maxZIndex == null)
			maxZIndex = google.maps.Marker.MAX_ZINDEX;
		else
			maxZIndex++;	
			
		if(showSelection)		
		{
			faultMarker.setZIndex(maxZIndex);
		}
	}
		
	function mapTypeChange(val){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
		util.switchMapType(map,val);
	}
 
    function clearMapItems()
	{
		for(var i=0;i<faultObjCollection.length;i++)
		{
			faultObjCollection[i].setMap(null); 
		}
	}
	function changeMapTypeAndResetMenu(value)
	{
		util.switchMapType(map,value);
		VLMapInfoControl.resetMenu();
	}	