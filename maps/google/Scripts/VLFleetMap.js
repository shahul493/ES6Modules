	'use strict';
    var vlSite;
    var markerClusterer;    
    var markersForClustering = null;
    var vlMapInfoWindow = null;
    var vlMapMenu;      
    var searchControl;
    var holdFitToMapOnResize = false;
    var holdAddOverlayOnResize = false;
    var selectedOverlayAssets = null;    
  
	function mapInitialized()
    {    	
    	google.maps.event.addListener(map, "mousemove", onMouseMove);
  		google.maps.event.addListener(map, "mouseout", onMouseOut); 
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.ASSET_LABEL_PREFERENCE_CHANGED, resetMapMenu);
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.METER_LABEL_PREFERENCE_CHANGED, resetMapMenu);
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.LANGUAGE_CHANGED, resetMapMenu);
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapTypeAndResetMenu);
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.ALLASSET_SELECTION_CHANGED, changeAllAssetMenu);
		  
		var mapMenuOptions = {};  
		mapMenuOptions.mapToolMenuSelections = util.mapToolMenuSelections;
		
		mapMenuOptions.showMaptype = true;
		mapMenuOptions.showAllAssets = true; 
		mapMenuOptions.showDetails = true; 
		mapMenuOptions.showLabels = true;
		
		
		mapMenuOptions.mapTypeChangeFn = mapTypeChange;
		mapMenuOptions.labelDetailChangeFn = labelDetailChange;
		mapMenuOptions.allAssetsChangeFn = allAssetsChange;		
		  
		vlMapMenu = new VLMapInfoControl.MapInfoControl(map,mapMenuOptions);
		searchControl = new SearchControl(map);
		vlSite = new VLSite(map);
		vlMapInfoWindow = new vss.controls.MapInfoWindow(false);  
		google.maps.event.addListener(vlMapInfoWindow, vss.common.InfoWindowEventType.CLOSE_INFO_WINDOW, removeGridSelection); 
		jQuery( window ).resize( handleResize);
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
    function addMainPageMapData(args)
    {
    
		//close find control
		if(searchControl != null){
			searchControl.resetSearchControl();
		}
    	var assetsToDisplayOnTheMap = [];
 		var dataList= util.parseJson(args);	
    	if (dataList != null) {
            for (var i = 0; i < dataList.length; i++) {
                if (dataList[i].latitude!=null && dataList[i].longitude!=null && !isNaN(dataList[i].latitude) && !isNaN(dataList[i].longitude))
                    assetsToDisplayOnTheMap.push(dataList[i]);
            }
        }
		
    	clearSelectedMarkers(); 
    	markersForClustering = VLAssetMarker.createCustomMarkers(map,assetsToDisplayOnTheMap,vlMapInfoWindow);
		clearMarkerClusterer();		
		markerClusterer = new MarkerClusterer(map, markersForClustering, constants.MARKER_CLUSTERER_OPTIONS);
		if(window.innerHeight == 0)
		{
			holdFitToMapOnResize = true;
		}
		else
		{
			VLMapUtil.setMapCenter(map,markersForClustering,constants.MAX_ZOOM_ON_SEARCH);
		}
		//removeBusyCursor();
    }
    
    function addSelectedOverlay(assets){
    	if(window.innerHeight == 0)
    	{
    		holdAddOverlayOnResize = true;
    		selectedOverlayAssets = assets;
    		return;
    	}    
		if(searchControl != null)
		{
			searchControl.onCloseBtnClick();
		}
    	
    	var selectedAssets = assets[0].source;
    	var selectedAssetsLength = selectedAssets.length;
	    
	    clearSelectedMarkers();
    	if(markersForClustering != null)
    	{
	    	for(var i=0;i<selectedAssetsLength;i++)
			{
				for(var j=0;j<markersForClustering.length;j++)
				{
					if(selectedAssets[i] == markersForClustering[j].asset.assetID)
					{
						if(selectedAssetsLength == 1)
						{
							vlMapInfoWindow.createInfoWindow(map,markersForClustering[j].asset);
							break;
						}
						else
						{
							markersForClustering[j].setMap(map);
						}
					}
				}
			}
		}
	}
	function refreshInfoWindow()
	{
		var openedInfoWindowAsset = vlMapInfoWindow.getSelectedAssetData();
		if(openedInfoWindowAsset != null && vlMapInfoWindow.infoBox != null)
		{
			clearSelectedMarkers();
			vlMapInfoWindow.createInfoWindow(map,openedInfoWindowAsset);
		}
	}
	function refreshLabels()
	{
		for(var i=0;i<markersForClustering.length;i++)
		{
			if(markersForClustering[i].map != null)
			{
				//markersForClustering[i].remove();
				markersForClustering[i].draw();
			}
		}
	}
	function clearMapItems()
	{
		clearMarkerClusterer();			
	}
	
	function clearMarkerClusterer() 
	{
		if(markerClusterer != null) {
			markerClusterer.clearMarkers();
			markerClusterer = null;
		}	
	}
	function removeGridSelection()
	{
		if(vlMapInfoWindow != null)
			vlMapInfoWindow.infoBox = null;
		removeSelectedItemFromGrid();
	} 
	function clearSelectedMarkers()
	{
        if(vlMapInfoWindow != null)
		    vlMapInfoWindow.closeExistingInfoWindow();
	}
	
	function mapTypeChange(val){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
		util.switchMapType(map,val);
	}
	function labelDetailChange(labelDetailOptions){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.DETAILS_MENU, labelDetailOptions);
		if(vlMapInfoWindow.infoBox != null)
			refreshInfoWindow();
		refreshLabels();
	}
	function allAssetsChange(isAllAssetsSelected){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.ALL_ASSETS, isAllAssetsSelected);
	}
	
	function resetMapMenu(value)
	{
		VLMapInfoControl.resetMenu();
	}
	
	function changeMapTypeAndResetMenu(value)
	{
		util.switchMapType(map,value);
		VLMapInfoControl.updateMapTypeMenuSelection(value);
	}
	function changeAllAssetMenu(value)
	{
		VLMapInfoControl.updateAllAssetMenuSelection(value);
	}	
	
	function handleResize(){
        if(holdFitToMapOnResize == true)
        {
        	holdFitToMapOnResize = false;
		    if(markersForClustering != null) 
		    {
		    	setTimeout(function() { VLMapUtil.setMapCenter(map,markersForClustering)}, 1000);
		    }
		}
		
		if(holdAddOverlayOnResize == true)
		{
			holdAddOverlayOnResize = false;
			if(selectedOverlayAssets != null)
			{
				setTimeout(function() { addSelectedOverlay(selectedOverlayAssets); selectedOverlayAssets = null;}, 500);
			}
		}
	}		