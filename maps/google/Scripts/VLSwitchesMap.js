'use strict';       
var vlSite;
var vlMapMenu;
var vlSwitchInfoWindow = null;
var vlSwitchesMarkers;
var searchControl;

function mapInitialized() {
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
    vlMapMenu = new VLMapInfoControl.MapInfoControl(map, mapMenuOptions);
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
function mapTypeChange(val) {
    mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
    util.switchMapType(map, val);
}
function resetMapMenu(value) {
    VLMapInfoControl.resetMenu();
}
function loadSwitchesData(args) {	
	//close find control and clear search marker from map
	if(searchControl != null){
		searchControl.resetSearchControl();
	}
				  
	var runtimeEventsToShowOnMaps = [];  
    vlSwitchesMarkers = null;  

	for(var i=0;i<args.length;i++)
	{
		if(!isNaN(args[i].latitude) && !isNaN(args[i].longitude))
	  	{
	  		runtimeEventsToShowOnMaps.push(args[i]);
	  	}
	}
	VLSwitchesMarkers.clearMarkers();
		if(vlSwitchInfoWindow != null)
		{
			vlSwitchInfoWindow.closeExistingInfoWindow();
			vlSwitchInfoWindow = null;
		}
	vlSwitchInfoWindow = new vss.controls.SwitchesInfoWindow(); 
	vlSwitchesMarkers = VLSwitchesMarkers.createSwitchesMarkers(map, runtimeEventsToShowOnMaps, vlSwitchInfoWindow); 
}
function clearAllMapItems() {
    closeExistingInfoWindow();
    VLSwitchesMarkers.clearMarkers();
}
function changeSelectedMarkerColor(assetIDList) {	
	closeExistingInfoWindow();
    var boundsForSelection = new google.maps.LatLngBounds();
    for (var i = 0; i < vlSwitchesMarkers.length; i++) {
        vlSwitchesMarkers[i].setIcon(vlSwitchesMarkers[i].normalIcon)
    }
    for (var j = 0; j < assetIDList.length; j++) {
       for (var i = 0 ; i < vlSwitchesMarkers.length; i++) {
            if (vlSwitchesMarkers[i].eventID == assetIDList[j]) {
                vlSwitchesMarkers[i].setIcon(vlSwitchesMarkers[i].icons.rollOverIcon);
                boundsForSelection.extend(vlSwitchesMarkers[i].position);
                vlSwitchesMarkers[i].setZIndex(10000);
            }
            else {
                vlSwitchesMarkers[i].setZIndex(1);
            }
        }
    }  
}
function showSelectedInfoWindow(asset) {	
    var selectedAsset = asset[0];   
    vlSwitchInfoWindow.createSwitchesInfoWindow(map, selectedAsset);       
}
function closeExistingInfoWindow() {	
    if (vlSwitchInfoWindow != null)
        vlSwitchInfoWindow.closeExistingInfoWindow();
}
function resetMarkerColors() {
    for (var i = 0; i < vlSwitchesMarkers.length; i++) {
        vlSwitchesMarkers[i].setIcon(vlSwitchesMarkers[i].normalIcon);
    }
}
function removeGridSelection() {
    resetMarkerColors();
    removeItemSelectionFromGrid();
}
function changeMapTypeAndResetMenu(value) {
    util.switchMapType(map, value);
    resetMapMenu(value);
}