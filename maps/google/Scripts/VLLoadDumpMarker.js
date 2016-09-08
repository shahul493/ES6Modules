'use strict';
(function (namespace, $, undefined) 
{
  /* 
  Map markers/overlays that represent a single dump or load, or a grouped dump or load, and the paths between them.
  A single dump/load uses an image (dump.png/load.png), and a grouped dump/load uses a VLCustomMarker to show a small speech bubble.
  Clicking a marker shows a load/dump info window using VLLoadDumpInfoWindow.js

  to use:
    call any of clearLoadDumpMarkersAndPolylines, addLoadDumpPolyline, addLoadDumpMarker
  */
  var 
    LINE_COLOR = { outlier: 'red', normal: '#6699FF' },
    LINE_STROKE = { weight: 2, opacity: 0.5 },
    IMAGE_DEFINITION_DUMP = { url: 'images/dump.png', width: 14, height: 14 },
    IMAGE_DEFINITION_LOAD = { url: 'images/load.png', width: 14, height: 14 },
    Z_INDEX = { infoWindow: 101, single: 100, group: 99, lines: 98 };
  
  var markers = [];
  var polylines = [];
  
  namespace.clearLoadDumpMarkersAndPolylines = function (map) 
  {
    for (var i = 0; i < polylines.length; i++)
    {
      polylines[i].setMap(null);
    }
    polylines = [];
    for (var i = 0; i < markers.length; i++)
    {
      markers[i].setMap(null);
    }
    markers = [];
    VLLoadDumpInfoWindow.hideLastInfoWindow();
  };

  namespace.addLoadDumpPolyline = function (map, sitePoints, isOutlier)
  {
    var path = VLMapUtil.sitePointsToLatLng(sitePoints);
    var options = { map: map,
                    editable: false,
                    draggable: false,
                    clickable: true,
                    path: path,
                    strokeColor: isOutlier ? LINE_COLOR.outlier : LINE_COLOR.normal,
                    strokeOpacity: LINE_STROKE.opacity,
                    strokeWeight: LINE_STROKE.weight,
                    zIndex: Z_INDEX.lines };
    var polyline = new google.maps.Polyline(options);
    polylines.push(polyline);
  };
  
  namespace.addLoadDumpMarker = function (map, assetLocations, sitePoint, isLoad, isCycles)
  {
    if (!isNaN(sitePoint.lat) && !isNaN(sitePoint.lng))
    {
      var isSingle = assetLocations.length <= 1;
      if (isSingle)
      {
        addSingleDumpLoadMarker(map, assetLocations, sitePoint, isLoad, isCycles);
      }
      else
      {
        addGroupDumpLoadMarker(map, assetLocations, sitePoint, isLoad, isCycles);
      }
    }
  };
  
  function addSingleDumpLoadMarker(map, assetLocations, sitePoint, isLoad, isCycles)
  {
    var position = new google.maps.LatLng(sitePoint.lat, sitePoint.lng);
    var imageDef = isLoad ? IMAGE_DEFINITION_LOAD : IMAGE_DEFINITION_DUMP;
    var markerIcon = { url: imageDef.url,
                       size: new google.maps.Size(imageDef.width, imageDef.height),
                       origin: new google.maps.Point(0,0),
                       anchor: new google.maps.Point(Math.floor(imageDef.width / 2), Math.floor(imageDef.height / 2)) };
    var options = { position: position, 
                    map: map,
                    icon: markerIcon,
                    zIndex: Z_INDEX.single,
                    clickable: true }
    var marker = new google.maps.Marker(options);
    google.maps.event.addListener(marker, 'click', function() { dumpLoadMarkerClicked(map, marker, assetLocations, isLoad, isCycles); } );
    markers.push(marker);
  };
  
  function addGroupDumpLoadMarker(map, assetLocations, sitePoint, isLoad, isCycles)
  {
    var imageDef = isLoad ? IMAGE_DEFINITION_LOAD : IMAGE_DEFINITION_DUMP;
    var options = { sitePoint: sitePoint,
                    html: '<div style="background: transparent url(' + imageDef.url + ') no-repeat right center; font-weight: bold; font-size: 10pt;">' + assetLocations.length + '</div>',
                    useSpeechBubble: true,
                    click: function (e) { dumpLoadMarkerClicked(map, this, assetLocations, isLoad, isCycles); },
                    zIndex: Z_INDEX.group,
                    data: { assetLocations: assetLocations, sitePoint: sitePoint, isLoad: isLoad, isCycles: isCycles } };
    var customMarker = new VLCustomMarker.CustomMarker(map, options);                    
    markers.push(customMarker);
  };
  
  function dumpLoadMarkerClicked(map, marker, assetLocations, isLoad, isCycles)
  {
    var options = { assetLocations: assetLocations,
                    isLoad: isLoad,
                    isCycles: isCycles,
                    marker: marker,
                    zIndex: Z_INDEX.infoWindow };
    VLLoadDumpInfoWindow.showInfoWindow(map, options);
  };
  
} (window.VLLoadDumpMarker = window.VLLoadDumpMarker || {}, jQuery));
