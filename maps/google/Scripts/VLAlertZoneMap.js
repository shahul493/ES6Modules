	'use strict';   
	var zoneCollection = [],  	
  		markerClusterer,
  		zoneLibrary,
    	exclusionItems,
    	inclusionItems,
    	markersForClustering,    	
    	vlSite;
     
 	function mapInitialized()
    { 
    	google.maps.event.addListener(map, "mousemove", onMouseMove);
  		google.maps.event.addListener(map, "mouseout", onMouseOut); 
		google.maps.event.addListener(map, "bounds_changed", onBoundsChanged);    
		google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapTypeAndResetMenu);
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
    
    function onBoundsChanged() 
    {
	    var mapBounds_ = {};
	    var neBounds_ = map.getBounds().getNorthEast();
	    var swBounds_ = map.getBounds().getSouthWest();
	    mapBounds_.neLat = neBounds_.lat();
	    mapBounds_.neLng = neBounds_.lng();
	    mapBounds_.swLat = swBounds_.lat();
	    mapBounds_.swLng = swBounds_.lng();
        zoneMapBoundsChange(mapBounds_);
    }
    
    function clearCirclesFromMap()
    {
    	for(var i=0;i<zoneCollection.length;i++)
    	{
    		zoneCollection[i].setMap(null);    	
    	}
    }
    
    function setZones(args)
    { 
		var obj = args[0]; 
		zoneLibrary = obj.zoneLibrary;
		exclusionItems = obj.exclusionItems;
		inclusionItems = obj.inclusionItems;
		
		if(zoneCollection.length)
		{
			clearCirclesFromMap();
		};
		
		if(zoneLibrary && map)
		{
			loadZonesOnMap(zoneLibrary,"#000000");
		};
		if(exclusionItems && map)
		{
			loadZonesOnMap(exclusionItems,constants.EXCLUSION_ZONE_BORDER_COLOR);
		};
		if(inclusionItems && map)
		{
			loadZonesOnMap(inclusionItems,constants.INCLUSION_ZONE_BORDER_COLOR);
		};
    }
    
	function loadZonesOnMap(zoneList,colorVal){
		for(var i=0;i<zoneList.length;i++){
			var mapCircle = new google.maps.Circle({
			  id:zoneList[i].zoneId,
			  strokeColor: colorVal,
			  strokeOpacity: 1,
			  strokeWeight: 2,
			  fillColor: colorVal,
			  clickable: false,
			  fillOpacity: 0,
			  map: map,
			  center: new google.maps.LatLng(zoneList[i].centerLat,zoneList[i].centerLon),
			  radius: zoneList[i].radiusInMeters});
			  
			zoneCollection.push(mapCircle);
		}
	}
	
    function zoomToZone(zoneArgs) {
	  var zoneObj = zoneArgs[0];
	  for(var i=0;i<zoneCollection.length;i++)
		{
			if(zoneCollection[i].id == zoneObj.zoneId)
			{
				map.fitBounds(zoneCollection[i].getBounds());
			};
		};
	}
	
	function addMainPageMapData(assetArgs)
    {   
    	var assetsToDisplayOnTheMap = [];
    	var dataList = util.parseJson(assetArgs);	   	
    	if(dataList != null) {    	
	    	for(var i=0;i<dataList.length;i++)
			{
				if(dataList[i].latitude!=null && dataList[i].longitude!=null && !isNaN(dataList[i].latitude) && !isNaN(dataList[i].longitude))
					assetsToDisplayOnTheMap.push(dataList[i]);			
			}
    	} 
		markersForClustering = VLAssetMarker.createDefaultMarkers(map,assetsToDisplayOnTheMap);
		clearMarkerClusterer();		
		VLMapUtil.setMapCenter(map,markersForClustering);
		
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
	
	function changeMapTypeAndResetMenu(value)
	{
		util.switchMapType(map,value);
	}
	 