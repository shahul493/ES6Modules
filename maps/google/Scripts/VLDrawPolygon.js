(function (namespace, $, undefined) {

      var polyMap = null;
      var polygon = null;
      var polygonListener = null;
      var polyPath = null;
      var polyPointListener = null;
      var polyPointMoveListener = null;
      var polyMarkers = []; //on first and current point
      var onPolyComplete = null;
      var onPolyStart = null;
      var completed = false;
      var polyColor;
      var polyLineWidth;
      var toolIsActive = false;
      var hasLinkToCursor = false;
      var legendMoveListener = null;
      var legendClickListener = null;
  
  namespace.startPolygonTool = function(map, color, linewidth, cursorName, callbackStart, callbackEnd) {
    polyColor = color;
    polyLineWidth = linewidth;
    onPolyStart = callbackStart;
    onPolyComplete = callbackEnd;
    polyPath = new google.maps.MVCArray();
    polyMap = map;
    //Use http://www.cursor.cc/ to create a cursor file from an image
    polyMap.setOptions({ draggableCursor: cursorName });
    if (polyPointListener == null) {
      polyPointListener = google.maps.event.addListener(polyMap, 'click', onMouseClick);
      legendClickListener = google.maps.event.addListener(polyMap, vss.common.LegendEventType.LEGEND_CLICKED, onLegendClicked);
    }
    if (polyPointMoveListener == null) {
      polyPointMoveListener = google.maps.event.addListener(polyMap, 'mousemove', onMouseMove);
      legendMoveListener = google.maps.event.addListener(map, vss.common.LegendEventType.LEGEND_MOUSE_MOVED, onLegendMouseMoved);
    }
    toolIsActive = true;
    hasLinkToCursor = false;
  };

    function onLegendClicked(evt) {
        var latLng = VLMapUtil.pixelToLatLng(polyMap, evt.clientX, evt.clientY);
        onClick(latLng);
    }

    function onMouseClick(event) {
        onClick(event.latLng);
    }
  
  function onClick(latLng) {
      if (toolIsActive) {
        removeLinkToCursor();
        if (completed) {
          clearPoly();
        }
        polyPath.push(latLng);
        updatePolyMarkers(); 
        var len = polyPath.getLength();
        if (len == 1) {
            if (onPolyStart != null) {
              onPolyStart();
            }
        } 
        if (polygon == null) {
             polygon = new google.maps.Polygon({
              strokeColor: polyColor,
              strokeWeight: polyLineWidth,
              fillOpacity: 0,
              map: polyMap,
              paths: polyPath,
              clickable: false
             });    
         } 
      }
  }

    function onMouseMove(event) {
        onMove(event.latLng);
    }

    function onLegendMouseMoved(evt) {
        var latLng = VLMapUtil.pixelToLatLng(polyMap, evt.clientX, evt.clientY);
        onMove(latLng);
    }
  
  function onMove(latLng) {
      if (toolIsActive) {
        if (!completed) {
            var len = polyPath.getLength();
            if (len > 0) {
                removeLinkToCursor();
                addLinkToCursor(latLng);
            }
        }
      }
  }
  
  function removeLinkToCursor() {
      if (hasLinkToCursor) {
        polyPath.pop();
        hasLinkToCursor = false;
      }
  }
  
  function addLinkToCursor(latLng) {
      polyPath.push(latLng);
      hasLinkToCursor = true;
  }
  
  function updatePolyMarkers() {
    var marker = null;
 
    var len = polyPath.getLength();
    if (len <= 2) { 
       var markerIcon = {
            url: "images/PolygonMarker.png",
            anchor: new google.maps.Point(5,5),
            scaledSize: new google.maps.Size(10,10)            
            };
                
        marker = new google.maps.Marker({
          icon: markerIcon,
          map: polyMap,
        });
            
        polyMarkers.push(marker);
        addPolyMarkerEventListeners(marker);       
    }
    else {
        //Move the second marker to the last point
        marker = polyMarkers[1];
    }
    marker.setPosition(polyPath.getAt(len - 1));
  } 
  
 function polyFinished() {
    removePolyMarkers();
    completed = true;
    if (onPolyComplete != null) {
        onPolyComplete(polyPath.getArray());       
    }
  } 
  
  function removePolyMarkers() {
    for (var i = 0; i < polyMarkers.length; i++) {
      google.maps.event.clearListeners(polyMarkers[i], "click");
      polyMarkers[i].setMap(null);
    }
    polyMarkers = [];
  }
  
  function addPolyMarkerEventListeners(marker) {
    google.maps.event.addListener(marker, 'click', function () {
      //Close polygon if first point
      if (polyMarkers[0] == marker && polyPath.getLength() >= 3) {
        removeLinkToCursor();
        polyFinished();
      }
      //Only remove last point
      else if (polyMarkers[polyMarkers.length - 1] == marker) {
        removeLinkToCursor();
        removeLastPolyPoint();
      }
      else {
      }
    });
  }
 
  function removeLastPolyPoint() {
  
    if (polygon != null) {
      var index = polyPath.getLength() - 1;
      if (index > 0) {
        if (index == 1) {
            //Remove 2nd marker
            polyMarkers[index].setMap(null);
            polyMarkers.splice(index, 1);
        }
        else {
            //Move 2nd marker to previous point 
            polyMarkers[1].setPosition(polyPath.getAt(index - 1));           
        }        
        polyPath.removeAt(index);           
      }
      else {
        clearPoly();
      }
    }
  }
  
  function clearPoly() {
   
    removePolyMarkers();
    if (polygonListener != null) {
      google.maps.event.removeListener(polygonListener);
      polygonListener = null;
    }
    if (polygon != null) {
      polygon.setMap(null);
    }
    polygon = null;
    if (polyPath != null) {
        polyPath.clear();
    }
    hasLinkToCursor = false;
    completed = false;   
  }
  
  namespace.endPolygonTool = function() {  
    clearPoly();  
    if (polyPointListener != null) {
        google.maps.event.removeListener(polyPointListener);
        google.maps.event.removeListener(legendClickListener);
    }
    polyPointListener = null; 
    if (polyPointMoveListener != null) {
        google.maps.event.removeListener(polyPointMoveListener);
        google.maps.event.removeListener(legendMoveListener);
    }
    polyPointMoveListener = null; 
    polyPath = null;
    polyMap.setOptions({draggableCursor:'default'});
    toolIsActive = false;
    hasLinkToCursor = false;
  } 
  
 
} (window.VLDrawPolygon = window.VLDrawPolygon || {}, jQuery));