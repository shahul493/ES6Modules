	'use strict';
    var manualMaintenanceObject = null;   
    var vlSite;
    var clickListener = null;
    var updatedMaintenanceObject = null;
	function mapInitialized()
    {
		google.maps.event.addListener(map, "mousemove", onMouseMove);
  		google.maps.event.addListener(map, "mouseout", onMouseOut); 		
		   
		var mapMenuOptions = {};  
		mapMenuOptions.showMaptype = true;
		mapMenuOptions.mapTypeChangeFn = mapTypeChange;		  
		VLMapInfoControl.MapInfoControl(map,mapMenuOptions);
		
		var searchControl = new SearchControl(map);
		searchControl.resetSearchControl();
		vlSite = new VLSite(map);    
        vlSite.isEditMode = true;
         mapReady();
	}  
    function addClickListenerForMap(value)
    {
    	updatedMaintenanceObject = null;
    	manualMaintenanceObject = null;
    	manualMaintenanceObject = value[0];
    	
    	if(!isNaN(manualMaintenanceObject.latitude) && !isNaN(manualMaintenanceObject.longitude))
    	{
    		ManualMaintenanceMarker.createMaintenanceMarkers(map,manualMaintenanceObject,true);
    	}
    	else
    	{
    		ManualMaintenanceMarker.clearMapMarkers();
    	}
    	
    	clickListener = google.maps.event.addListener(map, "click", onMapClick);
    }
    function onMapClick(event)
    {
    	updatedMaintenanceObject = null;
    	updatedMaintenanceObject = util.shallowCopy(manualMaintenanceObject);
    	
    	var isEmptyLocation = false;
    	if(isNaN(manualMaintenanceObject.latitude) && isNaN(manualMaintenanceObject.longitude))
    	{
    		isEmptyLocation = true;
    	}
    	updatedMaintenanceObject.latitude = event.latLng.lat();
    	updatedMaintenanceObject.longitude = event.latLng.lng();
    	if(isEmptyLocation)
    	{
    		ManualMaintenanceMarker.createMaintenanceMarkers(map,updatedMaintenanceObject);
    	}
    	else
    		ManualMaintenanceMarker.changeMarkerPosition(map,event.latLng,false)
    	
    	enableSetLocationButton(updatedMaintenanceObject);
    }
    function removeClickListenerForMap()
    {
    	if(clickListener != null)
    	google.maps.event.removeListener(clickListener);
    }
    
    function addSitePolygons(siteList) {          	        
        vlSite.clearSitePolygons();        
        if (siteList.length > 0) { 
           vlSite.addSitePolygons(siteList);
        }
    }
     
    function mapTypeChange(val){
		mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
		util.switchMapType(map,val);
	}
