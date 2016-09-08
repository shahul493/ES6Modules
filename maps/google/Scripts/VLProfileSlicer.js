(function (namespace, $, undefined) {
  
      var lineMap = null;
      var polyline = null;
      var polylinePath = null;
      var polylineListeners = [];
      var completed = false;
      var dragging = false;
      var enabled = true;
      var mouseMoveListener = null;
      var mouseClickListener = null;
      var lineMarker1 = null;
      var lineMarker2 = null;
      var lineMarkerListeners = [null, [], []];
      var coordsListener = null;
      var mouseMoveActive = false;
       
  namespace.startLineTool = function(map) {
    lineMap = map;
    lineMap.setOptions({ draggableCursor: constants.DRAW_CURSOR_URL });

    if (mouseClickListener == null) {
      mouseClickListener = google.maps.event.addListener(map, "click", onMouseClick);
    }
    enabled = true;
  };

    function onMouseClick(evt) {

        if (mouseMoveActive)
            onMouseUp(evt);
        else
            onMouseDown(evt);
    }
  
  function onMouseDown(event) {
     if (enabled) {
       //If a drag is released off the map, the mouse up event is not fired. 
       //When returning and receiving the first mouse down, continue with the drag 
       //ie. ignore the mouse down when only the first marker exists.
       if (lineMarker1 == null || lineMarker2 != null) { 
         clearLine();
         lineStart();
         lineMap.setOptions({draggable:false});
         createPolyline(event.latLng);
         lineMarker1 = createLineMarker(event.latLng, 1);
         if (mouseMoveListener == null) {
            mouseMoveListener = google.maps.event.addListener(map, "mousemove", onMouseMove);    
         }
       }
       mouseMoveActive = true;
     }
  }
  

  function onMouseMove(event) {
    if (enabled && mouseMoveActive) {
      polylinePath.setAt(1, event.latLng);    
    }
  }
  
  function onMouseUp(event) {
     if (enabled) {
       mouseMoveActive = false;
       removeListener(mouseMoveListener);
       mouseMoveListener = null;
       polylinePath.setAt(1, event.latLng);
       removeLineMarker(lineMarker2, 2);
       lineMarker2 = createLineMarker(event.latLng, 2);    
       completed = true;   
       lineMap.setOptions({draggable:true}); 
       polyline.setOptions({clickable: true});  //so we get mouse events
       lineComplete({vertices:VLMapUtil.latLngsToString(polylinePath.getArray()), moved:false});
     }
  }
  
  function createPolyline(latLng) {
     polylinePath = new google.maps.MVCArray();
     polylinePath.push(latLng);
     polylinePath.push(latLng);
     polyline = new google.maps.Polyline({
        strokeColor: constants.PROFILE_TOOL_COLOR,
        strokeWeight: constants.PROFILE_TOOL_LINEWIDTH,
        map: lineMap,
        path: polylinePath,
        clickable: false, //stop it consuming the mouse up event
        draggable: true,
        zIndex: 1000
       });
     polylineListeners.push(google.maps.event.addListener(polyline, 'mousedown', onPolylineMouseDown));
     polylineListeners.push(google.maps.event.addListener(lineMap, 'mousemove', onMapMouseMove));
     polylineListeners.push(google.maps.event.addListener(polyline, 'drag', onPolylineDrag));
     polylineListeners.push(google.maps.event.addListener(polyline, 'dragend', onPolylineDragEnd));
     polylineListeners.push(google.maps.event.addListener(polyline, 'mouseover', onPolylineMouseOver));
     polylineListeners.push(google.maps.event.addListener(polyline, 'mouseout', onPolylineMouseOut));
  }
  
  function removePolyline() {
    var listener;
    while (listener = polylineListeners.pop()) {
      google.maps.event.removeListener(listener);
    }
    if (polyline != null) {
      polyline.setMap(null);
    }
    polyline = null;
    if (polylinePath != null) {
      polylinePath.clear();
      polylinePath = null;
    }
  }
  
  function onPolylineMouseDown(event) {
    //Deliberately empty. 
    //Capturing the mouse down on the polyline prevents the map handling the mouse down, and therefore preventing the line being deleted.
    //We want to keep the line so that it can be dragged.
  }
  
  function onMapMouseMove(event) {
    if (completed && !dragging && enabled) {
      if (VLMapUtil.findPolygonWithEdgeAtPoint(event.latLng, [polyline])) {
        profileCoordsChanged(event.latLng.lat(), event.latLng.lng());
      }
    }
  }
  
  function onPolylineDrag(event) {
    dragging = true;
    if (polylinePath.length >= 1 && lineMarker1 != null) {
      lineMarker1.setPosition(polylinePath.getAt(0));
    }
    if (polylinePath.length >= 2 && lineMarker2 != null) {
      lineMarker2.setPosition(polylinePath.getAt(1));
    }
  }
  
  function onPolylineDragEnd(event) {
    onPolylineDrag(event);
    dragging = false;
    lineComplete({vertices:VLMapUtil.latLngsToString(polylinePath.getArray()), moved:true});
  }
  
  function onPolylineMouseOver(event) {
    if (enabled && completed && !dragging) {
      $('#map_canvas').addClass('draggingPolylineOnMap'); //technique for showing a cursor on a polyline - see http://stackoverflow.com/questions/16552790/google-maps-api-3-change-polygons-default-cursor
    }
  }
  
  function onPolylineMouseOut(event) {
    if (enabled && completed && !dragging) {
      $('#map_canvas').removeClass('draggingPolylineOnMap');
    }
  }
  
  function createLineMarker(position, markerNumber) {
     var marker = new google.maps.Marker({
          map: lineMap,
          position: position,
          icon: {
            url: "images/LineMarker.png",
            anchor: new google.maps.Point(3,3)
          },
          clickable: false,
          draggable: true,
          cursor: constants.RESIZE_CURSOR_URL
        });     
  
     lineMarkerListeners[markerNumber].push(google.maps.event.addListener(marker, 'drag', function (e) { onMarkerDrag(e, markerNumber); } ));
     lineMarkerListeners[markerNumber].push(google.maps.event.addListener(marker, 'dragend', function (e) { onMarkerDragEnd(e, markerNumber); } ));
     return marker;
  }
  
  function removeLineMarker(marker, markerNumber) {
    var listener;
    while (listener = lineMarkerListeners[markerNumber].pop()) {
      google.maps.event.removeListener(listener);
    }
    if (marker != null) {
        marker.setMap(null);
    }
  }
  
  function onMarkerDrag(event, markerNumber) {
    dragging = true;
    polylinePath.setAt(markerNumber - 1, event.latLng);
  }
  
  function onMarkerDragEnd(event, markerNumber) {
    onMarkerDrag(event, markerNumber);
    dragging = false;
    lineComplete({vertices:VLMapUtil.latLngsToString(polylinePath.getArray()), moved:false});
  }
  
  function removeListener(listener) {
    if (listener != null) {
      google.maps.event.removeListener(listener);
    }
  }
  
  function clearLine() {  
    removeLineMarker(lineMarker1, 1);
    lineMarker1 = null;
    removeLineMarker(lineMarker2, 2);
    lineMarker2 = null;
    removeListener(coordsListener);
    coordsListener = null;
    removePolyline();
    completed = false;   
    dragging = false;
    enabled = true;
  }
  
  namespace.endLineTool = function(pause) {  
    if (pause) {
      enabled = false;
    } else {
      clearLine();  
      mouseMoveActive = false;
      removeListener(mouseMoveListener);
      mouseMoveListener = null
      removeListener(mouseClickListener);
      mouseClickListener = null;
    }
    lineMap.setOptions({draggable:true, draggableCursor:'default'});    
  }     
  
} (window.VLProfileSlicer = window.VLProfileSlicer || {}, jQuery));
