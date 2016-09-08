  'use strict';
  var boundsChanging = false;
         
    //Setting and Getting Bounds of a map        
  	var vlSite;      
    var vlMapMenu;
    var vlMapInfoWindow = null;
    var vlHoursLocationMarkers;
    var searchControl;
   
	function mapInitialized()
    {    	
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.ASSET_LABEL_PREFERENCE_CHANGED, resetMapMenu);	    
	    google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapTypeAndResetMenu);	    
		google.maps.event.addListener(map, "mousemove", onMouseMove);
  		google.maps.event.addListener(map, "mouseout", onMouseOut); 		
		   
		var mapMenuOptions = {};  
		mapMenuOptions.mapToolMenuSelections = util.mapToolMenuSelections;
		
		mapMenuOptions.showMaptype = true;
		mapMenuOptions.showAllAssets = false;
		mapMenuOptions.showMapTools = false;
		mapMenuOptions.showSiteFill = false;		 		
		mapMenuOptions.showLabels = false;
		mapMenuOptions.showDetails = false;
		mapMenuOptions.navInfoMapType = false;		
		
		mapMenuOptions.mapTypeChangeFn = mapTypeChange;		
		  
		vlMapMenu = new VLMapInfoControl.MapInfoControl(map,mapMenuOptions);
		searchControl = new SearchControl(map); 	
		vlSite = new VLSite(map); 
		mapReady();	   
	}    
    
     
    function addSitePolygons(siteList) {          	        
        vlSite.clearSitePolygons();        
        if (siteList.length > 0) { 
           vlSite.addSitePolygons(siteList);
        }
    }
    
    function zoomToCurrentSite(args) {       
       vlSite.zoomToCurrentSite(args[0]);        
    }     
    
    function mapTypeChange(val){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
		util.switchMapType(map,val);
	}	
	
    function resetMapMenu(value)
	{
		VLMapInfoControl.resetMenu();
	}
	
	function loadAssetHistoryData(args) 
	{
		//close find control and clear search marker from map
		if(searchControl != null){
			searchControl.resetSearchControl();
		}
		
	  var runtimeEventsToShowOnMaps = [];  
	  vlHoursLocationMarkers = null;  
	
	  for(var i=0;i<args.length;i++)
	  {
	  	if(!isNaN(args[i].latitude) && !isNaN(args[i].longitude))
	  	{
	  		runtimeEventsToShowOnMaps.push(args[i]);
	  	}
	  }
	  VLHoursLocationMarkers.clearMarkers();
	  if(vlMapInfoWindow != null)
	  {
	  	vlMapInfoWindow.closeExistingInfoWindow();
	  	vlMapInfoWindow = null;
	  }
	  vlMapInfoWindow = new vss.controls.HoursLocationInfoWindow(); 
	  vlHoursLocationMarkers = VLHoursLocationMarkers.createHoursLocationMarkers(map,runtimeEventsToShowOnMaps,vlMapInfoWindow); 
	}
	function clearAllMapItems()
	{
		closeExistingInfoWindow();
		VLHoursLocationMarkers.clearMarkers();
	}
	function changeSelectedMarkerColor(Ids)
	{
		var validLocationCount = 0;
		var boundsForSelection = new google.maps.LatLngBounds();
		for(var i = 0; i < vlHoursLocationMarkers.length;i++)
		{
			vlHoursLocationMarkers[i].setIcon(vlHoursLocationMarkers[i].normalIcon)
		}
		//resetMarkerColors();
		for(var j=0;j<Ids.length;j++)
		{
			if(!isNaN(Ids[j].latitude) && !isNaN(Ids[j].longitude))
				validLocationCount++;
				
			for(var i = 0 ; i < vlHoursLocationMarkers.length;i++)
			{	
				//vlHoursLocationMarkers[i].setIcon(vlHoursLocationMarkers[i].normalIcon);
				if(vlHoursLocationMarkers[i].asset.RuntimeLocationEventID == Ids[j].RuntimeLocationEventID)
				{
					vlHoursLocationMarkers[i].setIcon(vlHoursLocationMarkers[i].rolloverImage);
					boundsForSelection.extend(vlHoursLocationMarkers[i].position);
					vlHoursLocationMarkers[i].setZIndex(10000);
				}
				else
				{
					vlHoursLocationMarkers[i].setZIndex(1);
				}
			}
		}
		if(validLocationCount > 0)
			map.fitBounds(boundsForSelection);
	}
	function showSelectedInfoWindow(asset)
	{
			var selectedAsset = asset[0];
			vlMapInfoWindow.createInfoWindow(map,selectedAsset);
	}
	function closeExistingInfoWindow()
	{
		if(vlMapInfoWindow != null)
			vlMapInfoWindow.closeExistingInfoWindow();
	}
	function resetMarkerColors()
	{
		for(var i = 0; i < vlHoursLocationMarkers.length;i++)
		{
			vlHoursLocationMarkers[i].setIcon(vlHoursLocationMarkers[i].normalIcon)
		}
	}
	
	function removeGridSelection()
	{
		resetMarkerColors();
		removeItemSelectionFromGrid();		
	} 
	function changeMapTypeAndResetMenu(value)
	{
		util.switchMapType(map,value);
		resetMapMenu(value);
	}	