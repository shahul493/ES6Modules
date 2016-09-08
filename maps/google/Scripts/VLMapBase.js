'use strict';
var map = null;
var vlMapOptions;
var loading = false;

var defaultMapMenuSelection = {id:"",
    labelMenuNone:false,
    labelMenuAssetID:true,
    labelMenuSerialNumber:false,
    labelMenuMakeModel:false,
    labelMenuLocation:false,
    labelMenuHours:false,
    labelMenuLastKnownState:false,
    labelMenuDateLastReported:false,
    labelMenuFuelPercentRemaining:false,
    labelMenuNumberOfAlerts:false,
    labelMenuMileage:false,
    labelMenuVIN:false,
    detailsMenuAssetID:false,
    detailsMenuMakeModel:false,
    detailsMenuLocation:true,
    detailsMenuHours:false,
    detailsMenuLastKnownState:true,
    detailsMenuDateLastReported:true,
    detailsMenuFuelPercentRemaining:true,
    detailsMenuNumberOfAlerts:true,
    detailsMenuMileage:true,
    detailsMenuVIN:true,
    detailsMenuDesign:false
};
var defaultOptions = {
    clientId: "",
    channelId: "",
    language: "en",
    preferenceID: "",
    mapType: vss.common.EnumMapType.MAP,
    allAssetSelected : false,
    labelDetailOptions:  defaultMapMenuSelection,
    assetLabelPreference:  vss.common.EnumAssetLabelPreferenceType.SerialNumber,
    meterLabelPreference: vss.common.EnumMeterLabelPreferenceType.HourMeter,
    showNavInfoMapType: false,
    themeColor: null,
    customMapTileURL: "",
    mapABCUrl: "",
    mapABCKey:""
};
function loadMaps() {
    if(vlMapOptions.showNavInfoMapType)
    {
        jQuery.getScript('http://ditu.google.cn/maps/api/js?v=3.16&' +
            'callback=initialize' +
            '&sensor=false' +
            '&ssl=false&libraries=drawing,geometry' +
            '&client=' + vlMapOptions.clientId + '&channel='+ vlMapOptions.channelId + '&language=' + vlMapOptions.language);
    }
    else
    {
        jQuery.getScript('https://maps.googleapis.com/maps/api/js?v=3.16&' +
            'callback=initialize' +
            '&sensor=false' +
            '&ssl=false&libraries=drawing,geometry' +
            '&client=' + vlMapOptions.clientId + '&channel='+ vlMapOptions.channelId + '&language=' + vlMapOptions.language);
    }
    setTimeout(showCustomerInfo,300000);
}
function showCustomerInfo() {
    if (typeof google == 'undefined' && vlMapOptions.environment == 'CN') {
        var mapCanvas = document.getElementById('map_canvas')
        var errorHolder = document.createElement('DIV');
        errorHolder.setAttribute('class', "centerAlign");
        var errorText = document.createElement('p');
        errorText.innerHTML = getString('vlChinaMapIssueString');
        errorHolder.appendChild(errorText);
        mapCanvas.appendChild(errorHolder);
        return;
    }
}

function initialize() {
    loading = true;

    var mapOptions = {
        zoom:1,
        minZoom:1,
        center: new google.maps.LatLng(0.0, 0.0),
        mapTypeId: vss.common.EnumMapType.getGoogleMapType(vlMapOptions.mapType),
        draggableCursor: 'default',
        disableDoubleClickZoom: false,
        scrollwheel: true,
        panControl:true,
        navigationControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.ZOOM_PAN
        },
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        tilt: 0,
        streetViewControl: false,
        styles: constants.MAP_STYLES_OPTION,
        vlMapOptions: vlMapOptions
    };
    if(vlMapOptions.showNavInfoMapType)
    {
        mapOptions.mapTypeControlOptions = { mapTypeIds: [vss.common.EnumMapType.NAV_INFO_MAP]};
        /*window.MapABCClientGeocoder = new vss.geocoder.MapABCClientGeocoder(vlMapOptions.mapABCUrl, vlMapOptions.mapABCKey);*/
    }
    map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
    if(vlMapOptions.showNavInfoMapType)
    {
        var navInfoMapType = new vss.maptype.NavInfoMapType(vlMapOptions.customMapTileURL);
        map.mapTypes.set(vss.common.MapTypeId.NAV_INFO_MAP, navInfoMapType);
        map.setMapTypeId(vss.common.EnumMapType.getGoogleMapType(vss.common.EnumMapType.NAV_INFO_MAP));
        var copyrightDiv = document.createElement("div");
        copyrightDiv.id = "map-copyright";
        copyrightDiv.style.backgroundColor="#f5f5f5";
        copyrightDiv.style.opacity=0.7;
        copyrightDiv.style.fontSize="10px";
        copyrightDiv.style.paddingLeft="5px";
        copyrightDiv.style.paddingRight="5px";

        copyrightDiv.innerHTML = getString('copyRightNavInfo2011');
        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(copyrightDiv);
    }
    if(typeof mapInitialized == 'function')
        mapInitialized();
    google.maps.event.addListener(map, "tilt_changed", onTiltChanged);
    google.maps.event.addListener(map, "tilesloaded", onTilesLoaded);
}
 function onTilesLoaded() {
        if (loading) {
            loading = false;            
        }
    }
function sendMapOptions(args){
    vlMapOptions = jQuery.extend({}, defaultOptions, args[0]);
    if(vlMapOptions.labelDetailOptions == null)
    {
        vlMapOptions.labelDetailOptions = defaultMapMenuSelection;
        vlMapOptions.labelDetailOptions.id = vlMapOptions.preferenceID;
    }
    setTimeout(loadMaps,100);
}

function assetLabelPreferenceChanged(args){
    vlMapOptions.assetLabelPreference = args[0];
    google.maps.event.trigger(vlMapOptions, vss.common.MapOptionsEventType.ASSET_LABEL_PREFERENCE_CHANGED, vlMapOptions.assetLabelPreference);
}

function meterLabelPreferenceChanged(args){
    vlMapOptions.meterLabelPreference = args[0];
    google.maps.event.trigger(vlMapOptions, vss.common.MapOptionsEventType.METER_LABEL_PREFERENCE_CHANGED, vlMapOptions.meterLabelPreference);
}

function languageChanged(args){
    vlMapOptions.language = args[0];
    google.maps.event.trigger(vlMapOptions, vss.common.MapOptionsEventType.LANGUAGE_CHANGED, vlMapOptions.language);
}

function mapTypeChanged(args){
    vlMapOptions.mapType = args[0];
    google.maps.event.trigger(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, vlMapOptions.mapType);
}

function allAssetSelectionChanged(args){
    vlMapOptions.allAssetSelected = args[0];
    google.maps.event.trigger(vlMapOptions, vss.common.MapOptionsEventType.ALLASSET_SELECTION_CHANGED, vlMapOptions.allAssetSelected);
}

function onTiltChanged() {
    if (map.getTilt() == 45)
        map.setTilt(0);
}

function getViewPortPoints() {
    var viewportPoints = null;
    var bounds = null;

    bounds = map.getBounds();

    if(bounds != null) {
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        if(ne != null && sw != null)
            viewportPoints = { neLat: ne.lat(), neLng: ne.lng(), swLat: sw.lat(), swLng: sw.lng() };
    }
    return viewportPoints;
}
function addBusyCursor()
{
    document.getElementById("map_canvas").className = "busyCursor";
    /*if(map != null)
        map.setOptions({draggableCursor:'url(../images/cursorImage.cur),url(images/cursorImage.cur),wait'});*/
}
function removeBusyCursor()
{
    document.getElementById("map_canvas").className = "defaultCursor";
    /*if(map != null)
        map.setOptions({draggableCursor:'default'});*/
}
