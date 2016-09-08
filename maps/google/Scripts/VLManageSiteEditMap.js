'use strict';
//Setting and Getting Bounds of a map
var vlSite;
var markerClusterer;
var markersForClustering = null;
var siteId = -1;
var inputChangeTimer;
var vlMapMenu;
var searchControl;
var newSiteInfoMsg = "";
var editSiteInfoMsg = "";
var invisibleSiteTypes = {};

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

  initLabelforControls();
  mapReady();
}


function clearSitePolygons() {
  //vlSite.clearSitePolygons();
}

function addSitePolygons(siteList) {	
  vlSite.clearSitePolygons();
  if (siteList.length > 0) {
    vlSite.addSitePolygons(siteList);
  }
}
//Editing the site with zooming
function zoomToCurrentSite(args) { 
  var site = args[0];  
  siteId = site.ID;
  document.getElementById('editSiteInfoLabel').innerHTML = editSiteInfoMsg;  
  setInputControls(site);
  vlSite.zoomToCurrentSite(siteId);
  var styleOptions;
  styleOptions = { siteColor: VLMapUtil.colorNumberToHexString(site.color),
    transparent: site.transparent
  }; 
  vlSite.updatePolygonWithStyle(siteId, styleOptions);  
  vlSite.isEditMode = true;  
}

function handleSiteNameChange() {	
	setTimeout(function() {handleInputChanges();}, 500);	
}

function handleColorChange() {
  var options = { siteColor: "#" + siteColorPicker.color.toString() };
  vlSite.updatePolygonWithStyle(siteId, options);
  handleInputChanges();
  setTimeout(function() {siteColorPicker.color.hidePicker(); siteFillCheckBox.focus();}, 100);
}

function handleSitefill(checkbox) {
  var options = { transparent: !checkbox.checked };
  vlSite.updatePolygonWithStyle(siteId, options);
  handleInputChanges();
}

function cboSiteTypeChange() {
  var elem = document.getElementById('cboSiteType');
  var color = elem.options[elem.selectedIndex].color;
  document.getElementById('siteColorPicker').color.fromString(color);
  handleColorChange();
}

function enableOrDisableCboSiteType(siteTypeID) {
	var disableSiteType = siteTypeID != vss.common.EnumSiteType.GENERIC_SITE;
	updateCboSiteType(!disableSiteType);
	document.getElementById("cboSiteType").disabled = disableSiteType;	 	
}

function enableOrDisableTxtSiteName(isMassHaulSite) {
    document.getElementById("txtSiteName").disabled = isMassHaulSite;     
}

function updateCboSiteType(detachSite) {	
	if(detachSite) {
		var importType = vss.common.EnumSiteType.IMPORT;
		var exportType = vss.common.EnumSiteType.EXPORT;			
		if (jQuery.isEmptyObject(invisibleSiteTypes)) {
			invisibleSiteTypes[importType] = $('#cboSiteType option[value = "' + importType + '"]').detach();
			invisibleSiteTypes[exportType] = $('#cboSiteType option[value = "' + exportType + '"]').detach();
		}	
	}
	else {
		for (var key in invisibleSiteTypes) {       	
        	$("#cboSiteType").append(invisibleSiteTypes[key]);		
        }
        invisibleSiteTypes = {};
	}
}

function handleInputChanges() { 
  if (typeof inputChangeTimer !== "undefined") 
  	clearTimeout(inputChangeTimer);

  inputChangeTimer = setTimeout(function () { 	
  	
  	var result = { siteName: txtSiteName.value,
			      selectedColor: parseInt(siteColorPicker.color.toString(), 16),
			      siteTypeID: parseInt(document.getElementById('cboSiteType').value),
			      selected: siteFillCheckBox.checked			      
    			};    
  	
  	if(siteId <= 0) {
  		var polyPoints = null;  		
  		
  		polyPoints = vlSite.getSitePolygonPath(siteId);
  		
  		if(polyPoints != null) {  		
  			$.extend( result, 
  					  {hasIntersection : vlSite.intersectionsExistInSitePolygon(polyPoints),
  					   polyPoints : VLMapUtil.latLngsToString(polyPoints)  					   
  					  });
  		} 		  		
  	}    
    onManageSitesEditInputsChanged(result);
  }, 100);
}


function updateEditMapPositionAndEnableDraw(args) {  
  siteId = -1; //New Site
  
  	var bounds_ = args[0];
	var southWest = new google.maps.LatLng(bounds_.swLat,bounds_.swLng);
	var northEast = new google.maps.LatLng(bounds_.neLat,bounds_.neLng);
	var bounds = new google.maps.LatLngBounds(southWest,northEast);
	map.fitBounds(bounds);
      	
  document.getElementById('editSiteInfoLabel').innerHTML = newSiteInfoMsg;

  setControlsToDefault();
  focusNameTextBox();
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
  if (searchControl) searchControl.onCloseBtnClick();
  vlSite.setDefaultPolygonStyle();
}

function refreshDraw() {
  vlSite.cleanUpSiteEdit();
  vlSite.drawSitePolygon();
}

function setControlsToDefault() {
  document.getElementById('siteColorPicker').color.fromString('000000');
  document.getElementById('siteFillCheckBox').checked = true;
  document.getElementById('txtSiteName').value = "";
  document.getElementById('cboSiteType').value = vss.common.EnumSiteType.GENERIC_SITE;      
  enableOrDisableCboSiteType(vss.common.EnumSiteType.GENERIC_SITE);
  enableOrDisableTxtSiteName(false);
}

function setInputControls(site) {
  enableOrDisableCboSiteType(site.siteTypeID);
  enableOrDisableTxtSiteName(site.isMassHaul);
  var color = (VLMapUtil.colorNumberToHexString(site.color)).slice(1); //remove the '#' as well  		 		
  document.getElementById('siteColorPicker').color.fromString(color);
  document.getElementById('siteFillCheckBox').checked = !site.transparent;
  document.getElementById('txtSiteName').value = site.name;
  document.getElementById('cboSiteType').value = site.siteTypeID;
  if (!site.isMassHaul)  
    focusNameTextBox();
}

function populateSiteBoundaryOptions(args) {	
  var siteTypes = args[0].sort(util.sortBy('lbl'));

  var siteTypeCbo = document.getElementById('cboSiteType') // find the drop down

  for (var i = 0; i < siteTypes.length; i++) {
    var opt = document.createElement("option");
    opt.color = (VLMapUtil.colorNumberToHexString(siteTypes[i].color)).slice(1);
    opt.innerHTML = siteTypes[i].lbl;
    opt.value = siteTypes[i].val;
    siteTypeCbo.appendChild(opt);
  } 	
}

function initLabelforControls() {  
  document.getElementById('lblSiteTitle').innerHTML = getString("title");
  document.getElementById('lblsiteFill').innerHTML = getString("siteFill");
  document.getElementById('lblSiteType').innerHTML = getString("siteCategory");
  document.getElementById("txtSiteName").setAttribute("placeholder", getString("chooseSiteTitle"));
  newSiteInfoMsg = getString("newSiteInfoMsg");
  document.getElementById('editSiteInfoLabel').innerHTML = newSiteInfoMsg;
  editSiteInfoMsg = getString("editSiteInfoMsg");    
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
			if(dataList[i].latitude!=null && dataList[i].longitude != null &&!isNaN(dataList[i].latitude) && !isNaN(dataList[i].longitude))
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

function clearMarkerClusterer() 
{
	if(markerClusterer != null) {
		markerClusterer.clearMarkers();
		markerClusterer = null;
	}	
}

function changeAllAssetMenu(value){
		VLMapInfoControl.updateAllAssetMenuSelection(value);
}

function focusNameTextBox() {
	document.getElementById("txtSiteName").select();
	setTimeout(function() {document.getElementById('txtSiteName').focus();}, 700);	 
}
