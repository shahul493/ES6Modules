'use strict';
var vlSite;
var markerClusterer;
var markersForClustering = null;
var siteId = -1;
var inputChangeTimer;
var vlMapMenu;
var searchControl;
var siteList = [];
var projectList = [];
function mapInitialized() {
  google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.ASSET_LABEL_PREFERENCE_CHANGED, resetMapMenu);  
  google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapTypeAndResetMenu);
  google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.ALLASSET_SELECTION_CHANGED, changeAllAssetMenu);  
  google.maps.event.addListener(map, "mousemove", onMouseMove);
  google.maps.event.addListener(map, "mouseout", onMouseOut); 		
		 
  var mapMenuOptions = {};
  mapMenuOptions.mapToolMenuSelections = util.mapToolMenuSelections;

  mapMenuOptions.showMaptype = true;
  mapMenuOptions.showAllAssets = true;

  mapMenuOptions.mapTypeChangeFn = mapTypeChange;
  mapMenuOptions.labelDetailChangeFn = labelDetailChange;
  mapMenuOptions.allAssetsChangeFn = allAssetsChange;

  vlMapMenu = new VLMapInfoControl.MapInfoControl(map, mapMenuOptions);
  searchControl = new SearchControl(map);

  vlSite = new VLSite(map);
  vlSite.polyPointsChanged = onPolypointsChanged;
  vlSite.maxPolypointReached = onMaxPolypointReached;  
  mapReady();
}
 

function addSitePolygons(args) {  
  siteList = args;
  //Scenario applies in Manage Project page. if project sites already added and site cache executed later very rare
  if(projectList.length >0) {
  	addProjectPolygons(projectList);
  }
  else {
  	vlSite.addSitePolygons(siteList);
  }  
}

function addProjectPolygons(projectlist) {  
  var allSites = [];
  projectList = projectlist;
  allSites = projectList.concat(siteList);
  vlSite.addSitePolygons(allSites);  	
}

function addSiteBoundaryPolygons(siteBoundaryList) {   
 vlSite.addSiteBoundaryPolygons(siteBoundaryList); 
}

function selectSiteBoundaryPolygon(args) {  
 vlSite.selectSiteBoundaryPolygon(args[0], args[1]);
}

//Editing the site with zooming
function zoomToCurrentSite(args) {	
  var siteID = args[0];  
  vlSite.zoomToCurrentSite(siteID);
  vlSite.isEditMode = true;
}

function handleInputChanges() {  
  if (typeof inputChangeTimer !== "undefined") 
  clearTimeout(inputChangeTimer);
  
  inputChangeTimer = setTimeout(function () {    
    
    var vertices = null;
    var hasIntersection = false;
    var result = null;
    
    vertices = vlSite.getSitePolygonPath(siteId);
    
    if(vertices != null){    	
    	hasIntersection = vlSite.intersectionsExistInSitePolygon(vertices);
    	vertices = VLMapUtil.latLngsToString(vertices);
    	result = { vertices : vertices, hasIntersection : hasIntersection};
    }    
    if(result != null) onSiteEditInputsChanged(result);
  }, 100);
}


function updateEditMapPositionAndEnableDraw(args) {  
  var bounds_ = args[0];
	var southWest = new google.maps.LatLng(bounds_.swLat,bounds_.swLng);
	var northEast = new google.maps.LatLng(bounds_.neLat,bounds_.neLng);
	var bounds = new google.maps.LatLngBounds(southWest,northEast);
	map.fitBounds(bounds);
      	
  siteId = -1; //New Site
  vlSite.siteTypeID = args[1];  
  vlSite.clearSitePolygons();
  vlSite.drawSitePolygon();
}

function onPolypointsChanged() {  
  handleInputChanges();
}

function onMaxPolypointReached() {
  maxPolyPointReached();
}


function cleanUpSiteEdit() {
  vlSite.cleanUpSiteEdit();
  if (searchControl != null) searchControl.onCloseBtnClick();
  vlSite.setDefaultPolygonStyle();
}

function refreshDraw() {
  vlSite.cleanUpSiteEdit();
  vlSite.drawSitePolygon();
}


function mapTypeChange(val) {
  mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
  util.switchMapType(map, val);
}
function labelDetailChange(labelDetailOptions) {
  mapMenuSelectionChange(vlMapOptions.preferenceID, constants.DETAILS_MENU, labelDetailOptions);
}
function allAssetsChange(isAllAssetsSelected) {
  mapMenuSelectionChange(vlMapOptions.preferenceID, constants.ALL_ASSETS, isAllAssetsSelected);
}

function resetMapMenu(value) {
  VLMapInfoControl.resetMenu();
}

function changeMapTypeAndResetMenu(value) {
  util.switchMapType(map, value);
  VLMapInfoControl.updateMapTypeMenuSelection(value);
}

function addMainPageMapData(args) {
  //close find control    
  if(searchControl != null){
	searchControl.resetSearchControl();
  }
  var assetsToDisplayOnTheMap = [];
  var dataList = util.parseJson(args);	   	
  if(dataList != null){
	  for(var i=0;i<dataList.length;i++)
		{
			if(dataList[i].latitude!=null && dataList[i].longitude != null && !isNaN(dataList[i].latitude) && !isNaN(dataList[i].longitude))
				assetsToDisplayOnTheMap.push(dataList[i]);			
		}
  }  	
    
  markersForClustering = VLAssetMarker.createDefaultMarkers(map, assetsToDisplayOnTheMap);
  clearMarkerClusterer();
  VLMapUtil.setMapCenter(map, markersForClustering)
  markerClusterer = new MarkerClusterer(map, markersForClustering, constants.MARKER_CLUSTERER_OPTIONS);
}

function clearMapItems() {
  clearMarkerClusterer();
}

function clearMarkerClusterer() {
	if(markerClusterer != null) {
		markerClusterer.clearMarkers();
		markerClusterer = null;
	}	
}

function changeAllAssetMenu(value)
{
	VLMapInfoControl.updateAllAssetMenuSelection(value);
}