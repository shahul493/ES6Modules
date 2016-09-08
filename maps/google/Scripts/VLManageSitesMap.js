var boundsChanging = false;
//Setting and Getting Bounds of a map
var vlSite;
var markerClusterer;
var markersForClustering = null;
var vlMapMenu;
var searchControl;
var allSites = [];
var siteList = [];
var activeProjects = [];
var archivedProjects;
var showArchive;

function mapInitialized() {

  google.maps.event.addListener(map, "bounds_changed", onBoundsChanged);
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
  mapReady();
}

function onBoundsChanged() {
  //Zooming or panning is happening
   var mapBounds = getMapLatlng();
  if(mapBounds != null)
  	boundsChanged(mapBounds);
}
   
function getMapLatlng() {
 	var mapBounds_ = {};
    var neBounds_ = map.getBounds().getNorthEast();
    var swBounds_ = map.getBounds().getSouthWest();
    mapBounds_.neLat = neBounds_.lat();
    mapBounds_.neLng = neBounds_.lng();
    mapBounds_.swLat = swBounds_.lat();
    mapBounds_.swLng = swBounds_.lng(); 
    return mapBounds_;
}

function addSitePolygons(args) {
  siteList = args;
  //Scenario applies in Manage Project page. if project sites already added and site cache executed later very rare
  if(activeProjects.length >0) {
  	addProjectPolygons([activeProjects, archivedProjects]);  	
  }
  else {
  	vlSite.addSitePolygons(siteList);
  }  
}

function addProjectPolygons(args) {  
  activeProjects = args[0];
  archivedProjects = args[1];
  
  allSites = activeProjects.concat(siteList);  
  vlSite.addSitePolygons(allSites);  
}

function zoomToCurrentSite(args) {  
  vlSite.zoomToCurrentSite(args[0]);   
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
  if (dataList != null) {  	
	  for(var i=0;i<dataList.length;i++)
	  {
		if(dataList[i].latitude!=null && dataList[i].longitude != null && !isNaN(dataList[i].latitude) && !isNaN(dataList[i].longitude))
			assetsToDisplayOnTheMap.push(dataList[i]);			
	  } 
	}   
  markersForClustering = VLAssetMarker.createDefaultMarkers(map, assetsToDisplayOnTheMap);
  clearMarkerClusterer();
  VLMapUtil.setMapCenter(map, markersForClustering);  
  markerClusterer = new MarkerClusterer(map, markersForClustering, constants.MARKER_CLUSTERER_OPTIONS);
}

function clearMapItems() {
  clearMarkerClusterer();
}

function clearMarkerClusterer() 
{
	if(markerClusterer != null) {
		markerClusterer.clearMarkers();
		markerClusterer = null;
	}	
}

function changeAllAssetMenu(value)	{
		VLMapInfoControl.updateAllAssetMenuSelection(value);
}	
//There is no layering in google map so have to clear and readd
function toggleLayerVisibility(args) {	
	showArchive = args[0];
	if(showArchive) {		
	  vlSite.addSitePolygons(archivedProjects);   
	}
	else {
		vlSite.addSitePolygons(allSites);
	}		
}

//There is no layering in google map so clear the items
function resetLayerVisibility() {	
	activeProjects = [];
}