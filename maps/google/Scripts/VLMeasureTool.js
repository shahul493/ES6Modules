(function (namespace, $, undefined) {
    
      var lineMap = null;
      var polyline = null;
      var polylinePath = null;
      var onLineComplete = null;
      var onLineInProgress = null;
      var onLineStart = null;
      var completed = false;
      var mouseMoveActive = false;
      var mouseMoveListener = null;
      var legendMoveListener = null;
      var mouseClickListener = null;
      var legendClickListener = null;
      var lineMarker1 = null;
      var lineMarker2 = null;
       
  namespace.startLineTool = function(map, callbackStart, callbackEnd, callbackInProgress) {
    onLineStart = callbackStart;
    onLineComplete = callbackEnd;
    onLineInProgress = callbackInProgress;
    polylinePath = new google.maps.MVCArray();
    lineMap = map;
    lineMap.setOptions({ draggableCursor: constants.MEASURE_CURSOR_URL });
 
    if (mouseClickListener == null) {
        mouseClickListener = google.maps.event.addListener(map, "click", onMouseClick);
        legendClickListener = google.maps.event.addListener(map, vss.common.LegendEventType.LEGEND_CLICKED, onLegendClicked);
    }
  };

    function onLegendClicked(evt) {
        var latLng = VLMapUtil.pixelToLatLng(lineMap, evt.clientX, evt.clientY);
        onClick(latLng);
    }

    function onMouseClick(event) {
        onClick(event.latLng);
    }

    function onClick(latLng) {

        if (mouseMoveActive)
            onMouseUp(latLng);
        else
            onMouseDown(latLng);
    }

    function onMouseDown(latLng) {
     //If a drag is released off the map, the mouse up event is not fired. 
     //When returning and receiving the first mouse down, continue with the drag 
     //ie. ignore the mouse down when only the first marker exists.
     if (lineMarker1 == null || lineMarker2 != null) { 
       clearLine();
       if (onLineStart != null) {
          onLineStart();
       }
       lineMap.setOptions({draggable:false});    
       polylinePath.push(latLng);
       polylinePath.push(latLng);
       polyline = new google.maps.Polyline({
          strokeColor: constants.MAP_TOOL_COLOR,
          strokeWeight: constants.MAP_TOOL_LINEWIDTH,
          map: lineMap,
          path: polylinePath,
          clickable: false    //stop it consuming the mouse up event
         });
       lineMarker1 = createLineMarker(latLng);
       if (mouseMoveListener == null) {
          mouseMoveListener = google.maps.event.addListener(map, "mousemove", onMouseMove);
          legendMoveListener = google.maps.event.addListener(map, vss.common.LegendEventType.LEGEND_MOUSE_MOVED, onLegendMouseMoved);
       }
     }
     mouseMoveActive = true;
  }

    function onMouseMove(event) {
        onMove(event.latLng);
    }

    function onLegendMouseMoved(evt) {
        var latLng = VLMapUtil.pixelToLatLng(lineMap, evt.clientX, evt.clientY);
        onMove(latLng);
    }

  function onMove(latLng) {
    if (mouseMoveActive) {
      polylinePath.setAt(1, latLng);
      if (onLineInProgress != null) {
          onLineInProgress(polylinePath.getArray());
      }   
    }
  }
  
  function onMouseUp(latLng) {
     mouseMoveActive = false;
     removeListener(mouseMoveListener);
     mouseMoveListener = null;
     polylinePath.setAt(1, latLng);
     removeMarker(lineMarker2);
     lineMarker2 = createLineMarker(latLng);
     completed = true;   
     lineMap.setOptions({draggable:true});      
     if (onLineComplete != null) {
        onLineComplete(polylinePath.getArray());
     }  
  }
  
  function createLineMarker(position) {
     var marker = new google.maps.Marker({
          map: lineMap,
          position: position,
          icon: {
              path: google.maps.SymbolPath.CIRCLE,
              strokeColor: constants.MAP_TOOL_COLOR,
              strokeOpacity: 1,
              strokeWeight: 1,
              fillColor: constants.MAP_TOOL_COLOR,
              fillOpacity: 1,
              scale: 5 //pixels
          },
          clickable: false
        });           

     return marker;
  }
  
  function removeListener(listener) {
    if (listener != null) {
      google.maps.event.removeListener(listener);
    }
  }
  
  function removeMarker(marker) {
    if (marker != null) {
        marker.setMap(null);
    }
  }
  
  function clearLine() {  
    removeMarker(lineMarker1);
    lineMarker1 = null;
    removeMarker(lineMarker2);
    lineMarker2 = null;
    if (polyline != null) {
      polyline.setMap(null);
    }
    polyline = null;
    if (polylinePath != null) {
        polylinePath.clear();
    }
    completed = false;   
  }
  
  namespace.endLineTool = function() {  
    clearLine();  
    mouseMoveActive = false;
    removeListener(mouseMoveListener);
    mouseMoveListener = null;
    removeListener(legendMoveListener);
    removeListener(mouseClickListener);
    mouseClickListener = null;
    removeListener(legendClickListener);
    polylinePath = null;
    lineMap.setOptions({draggableCursor:'default'});    
  }     
  
} (window.VLMeasureTool = window.VLMeasureTool || {}, jQuery));