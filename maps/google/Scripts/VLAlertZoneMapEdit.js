	'use strict';
	var zoneCollection = [],  	
  		markerClusterer,
  		zoneLibrary,    	
    	markersForClustering,   
    	searchControl;
 
 function mapInitialized()
     { 
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapTypeAndResetMenu);
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.ALLASSET_SELECTION_CHANGED, changeAllAssetMenu);				
		 
 		var mapMenuOptions = {};
 		mapMenuOptions.mapToolMenuSelections = util.mapToolMenuSelections;

 		mapMenuOptions.showMaptype = true;
 		mapMenuOptions.showAllAssets = true; 


 		mapMenuOptions.mapTypeChangeFn = mapTypeChange; 		
 		mapMenuOptions.allAssetsChangeFn = allAssetsChange;
 		
		VLAlertZone.editZone(map);
 		var mapInfo = new VLMapInfoControl.MapInfoControl(map,mapMenuOptions);
 		searchControl = new SearchControl(map);
 		mapReady();
	}
    
    function zoneMapSetBounds(args){
		var bounds_ = args[0];
		var southWest = new google.maps.LatLng(bounds_.swLat,bounds_.swLng);
		var northEast = new google.maps.LatLng(bounds_.neLat,bounds_.neLng);
		var bounds = new google.maps.LatLngBounds(southWest,northEast);
		map.fitBounds(bounds);
    }     
     
    function setZones(args)
    {   	
		var obj = args[0]; 
		zoneLibrary = obj.zoneLibrary;  
		
		if(zoneLibrary && map)
		{
			loadZonesOnMap(zoneLibrary,"#000000");
		}		 
    }    
     
	function loadZonesOnMap(zoneList,colorVal){
		for(var i=0;i<zoneList.length;i++){
			var mapCircle = new google.maps.Circle({
			  id:zoneList[i].zoneId,
			  strokeColor: colorVal,
			  strokeOpacity: 1,
			  strokeWeight: 2,
			  fillColor: colorVal,
			  fillOpacity: 0,
			  clickable: false,
			  map: map,
			  center: new google.maps.LatLng(zoneList[i].centerLat,zoneList[i].centerLon),
			  radius: zoneList[i].radiusInMeters
			});
			zoneCollection.push(mapCircle);
		}
	}
	
	function addMainPageMapData(args)
    {   
    	//close find control    
    	if(searchControl != null){
			searchControl.resetSearchControl();
		}
    	
    	var assetsToDisplayOnTheMap = [];
    	var dataList = util.parseJson(args);	
   	
    	if(dataList != null){
	    	for(var i=0;i<dataList.length;i++)
			{
				if(dataList[i].latitude!=null && dataList[i].longitude!=null && !isNaN(dataList[i].latitude) && !isNaN(dataList[i].longitude))
					assetsToDisplayOnTheMap.push(dataList[i]);			
			}
    	}
		markersForClustering = VLAssetMarker.createDefaultMarkers(map,assetsToDisplayOnTheMap);
		clearMarkerClusterer();
		
		markerClusterer = new MarkerClusterer(map, markersForClustering, constants.MARKER_CLUSTERER_OPTIONS);
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
    
	function mapTypeChange(val){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
		util.switchMapType(map,val);
	}	
	
	function allAssetsChange(isAllAssetsSelected){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.ALL_ASSETS, isAllAssetsSelected);
	}
	
	function changeMapTypeAndResetMenu(value){
		util.switchMapType(map,value);
		VLMapInfoControl.resetMenu();
	}
	
	function changeAllAssetMenu(value)
	{
		VLMapInfoControl.updateAllAssetMenuSelection(value);
	}
	 