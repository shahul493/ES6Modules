    //NOTE: Do not initialize any google map dependent variables here as we
    //load the map API dynamically so we can set the clientId and language.
    //Initialize them in the initialize() function.
    
    /* Z-ORDER
    The Maps API uses several layers known as MapPanes in a fixed Z order:
     6: floatPane (infowindow)
     5: overlayMouseTarget (mouse events)
     4: floatShadow (infowindow shadow)
     3: overlayImage (marker images)
     2: overlayShadow (marker shadows)
     1: overlayLayer (polygons, polylines, ground overlays, tile layer overlays)
     0: mapPane (lowest pane above the map tiles
     
    zindex property for individual items orders items within a map pane   
    */
   
    var projection;
    var wmsUrl;
    var wmsMapType = null;
    var wmsLayerVisible = true;
    var sendCoordinates = false;
    var lastMouseMovePosition = null;
    var insideMap = false;
    var numberLabel = null;  
    var profileMarker = null;
    var is3D = true;
    var assetMarkers = null;
    var assetMarkerInfoWindow = null;
    var clustererForAssetMarkers = null;
    var toolsMenuState = null;
    var tooltip = null;
    var tooltipTimerMousePaused = null;
    var tooltipTimerHintExpired = null;
 
    function mapInitialized() {
      
      loadScripts();
      
      projection = new MercatorProjection();
      initializeWmsMapType();
      
      map.overlayMapTypes.insertAt(constants.WMS_INDEX, wmsMapType);
      google.maps.event.addListener(map, "idle", onIdle);              
      google.maps.event.addListener(map, "zoom_changed", onZoomChanged);    
      google.maps.event.addListener(map, "tilesloaded", onTilesLoaded);    
      google.maps.event.addListener(map, "tilt_changed", onTiltChanged);
      google.maps.event.addListener(map, "mousemove", onMouseMove);
      google.maps.event.addListener(map, "mouseout", onMouseOut);
      google.maps.event.addListener(map, "mouseover", onMouseOver);
      google.maps.event.addDomListener(document, 'keydown', onKeyDown);  
      google.maps.event.addListener(vlMapOptions, vss.common.MapOptionsEventType.MAP_TYPE_CHANGED, changeMapType);            
       
      $("body").attr("onselectstart", "return false;"); //prevent blue selection highlighting in IE when dragging measure tool over markers, and prevent Ctrl+A selecting everything
      $("body").keydown(function(e) { if (e.keyCode == 65 && e.ctrlKey) e.preventDefault(); } ); //prevent Ctrl+A selecting the everything in FireFox

      initializeMenu();
      mapReady();
    };
    
    
    
    function formMapTypes() {
        //Override base google maps types so we can zoom to 24       
        map.mapTypes.set(google.maps.MapTypeId.ROADMAP, new CustomMapType(map.mapTypes.get(google.maps.MapTypeId.ROADMAP)));
        map.mapTypes.set(google.maps.MapTypeId.HYBRID, new CustomMapType(map.mapTypes.get(google.maps.MapTypeId.HYBRID)));
        map.mapTypes.set(google.maps.MapTypeId.SATELLITE, new CustomMapType(map.mapTypes.get(google.maps.MapTypeId.SATELLITE)));
        map.mapTypes.set(google.maps.MapTypeId.TERRAIN, new CustomMapType(map.mapTypes.get(google.maps.MapTypeId.TERRAIN)));            
    }
    
    
     
    
   function loadScripts() {
        var head = document.getElementsByTagName("head")[0];     
 
        var script = document.createElement("script");
        script.src = "Scripts/VLCustomMarker.js";
        script.type = "text/javascript";
        head.appendChild(script); 
        
        script = document.createElement("script");
        script.src = "Scripts/markerwithlabel.js";
        script.type = "text/javascript";
        head.appendChild(script);                                            
    }    
   
    
  
    function initializeWmsMapType() {
      wmsMapType = new google.maps.ImageMapType
      (
        {
          getTileUrl: function (coord, zoom) {
            if (!wmsUrl || !is3D) { return null; }
          
            var numTiles = 1 << zoom;
            var normalizedCoord = VLMapUtil.getNormalizedCoord(coord, numTiles);
            if (!normalizedCoord) { return null; }

            //Tile coordinate is top left. Tile is 256x256
            //BBOX is bottom left to top right (blLng,blLat,trLng,trLat)

            var bbox = VLMapUtil.tileBoundingBox(normalizedCoord.x, normalizedCoord.y, numTiles, projection);
            var url = wmsUrl + "&BBOX=" + bbox.blLng + "," + bbox.blLat + "," + bbox.trLng + "," + bbox.trLat;
            return url;
          },

          alt: "3D Project Monitoring Data",
          tileSize: new google.maps.Size(constants.TILE_SIZE, constants.TILE_SIZE),
          isPng: true,
          maxZoom: constants.MAX_ZOOM,
          minZoom: 1,
          opacity: 1.00,
          name: "3D Project Monitoring Data"
        }
      );
    }
    
    function initializeMenu() {
      var mapMenuOptions = {};  
      mapMenuOptions.mapToolMenuSelections = util.mapToolMenuSelections;
      
      mapMenuOptions.showMaptype = true; 
      mapMenuOptions.showMapTools = true;
      mapMenuOptions.showSiteFill = true;		  
      mapMenuOptions.showDetails = true;
      mapMenuOptions.showDesign = true; 
      
      mapMenuOptions.mapTypeChangeFn = menuItemMapTypeChange;
      mapMenuOptions.labelDetailChangeFn = menuItemLabelDetailChange;
      mapMenuOptions.mapToolChangeFn = menuItemToolChange;
      
      VLMapInfoControl.MapInfoControl(map, mapMenuOptions);
      if (!is3D) {
        VLMapInfoControl.showToolsMenuItem(constants.PRODUCTION_DATA_TOOL, false);
        VLMapInfoControl.showToolsMenuItem(constants.CELL_DETAILS_TOOL, false);
        VLMapInfoControl.showToolsMenuItem(constants.FILL_TOOL, false);
      }
      
      toolsMenuState = mapMenuOptions.mapToolMenuSelections;
    }
    
    function menuItemMapTypeChange(val) {
      //switch between map, hybrid, satellite, terrain
      mapMenuSelectionChange(vlMapOptions.preferenceID, constants.MAP_TYPE, val);
      util.switchMapType(map, val);
    }
    
    function menuItemLabelDetailChange(labelDetailOptions) {
      //chose fields displayed in asset info windows (eg, show Hours, Location, Fuel, etc)
      mapMenuSelectionChange(vlMapOptions.preferenceID, constants.DETAILS_MENU, labelDetailOptions); //calls flex
      if(assetMarkerInfoWindow.infoBox != null)
			refreshMarkerInfoWindow();
    }
    
    function menuItemToolChange(toolsState, changedTool) {
      toolsMenuState = toolsState;
        
      //change coordinates (lat/lng, dms, ne)
      if (changedTool == constants.NoCoords ||
          changedTool == constants.LatLong ||
          changedTool == constants.DMS ||
          changedTool == constants.NE) {
        mapToolMenuSelectionChange(constants.COORDS_TOOL, nameToCoordinateDisplayType(toolsState.coordsSelection)); //calls flex
      }
      
      //toggle assets
      if (changedTool == constants.ASSETS_TOOL) {
        VLAssetMarker.toggleAssetMarkerVisibility(toolsState.isAssetsTool);     
        clustererForAssetMarkers.repaint();
        
        if (assetMarkerInfoWindow != null) {
          assetMarkerInfoWindow.closeExistingInfoWindow();
        }
      }
      
      if (is3D) {

       //toggle production data
       if (changedTool == constants.PRODUCTION_DATA_TOOL) {
          wmsLayerVisible = toolsState.isProductionDataTool;
          map.overlayMapTypes.setAt(constants.WMS_INDEX, wmsLayerVisible ? wmsMapType : null);
          //Turn off cell details if on and prodn data off
          if (toolsState.isCellDetailsTool && !wmsLayerVisible) {
            VLMapInfoControl.updateToolsMenuSelection(constants.CELL_DETAILS_TOOL, false);
            mapToolMenuSelectionChange(constants.CELL_DETAILS_TOOL, false);
          }
          VLMapInfoControl.enableToolsMenuItem(constants.CELL_DETAILS_TOOL, wmsLayerVisible);
        }
         
        //toggle cell details               
        if (changedTool == constants.CELL_DETAILS_TOOL) {
          mapToolMenuSelectionChange(constants.CELL_DETAILS_TOOL, toolsState.isCellDetailsTool);
        }
               
        //toggle site fill
        if (changedTool == constants.FILL_TOOL) {
          VLSitePolygon.toggleSitePolygonsOpacity(toolsState.isFillTool);
        }
      }
      
      //toggle measure tool
      if (changedTool == constants.MEASURE_TOOL) {
        mapToolMenuSelectionChange(constants.MEASURE_TOOL, toolsState.isMeasureTool);
      }
      
      //toggle area tool
      if (changedTool == constants.AREA_TOOL) {
        mapToolMenuSelectionChange(constants.AREA_TOOL, toolsState.isAreaTool);
      }
      
      sendCoordinates = toolsState.coordsSelection != constants.NoCoords || toolsState.isCellDetailsTool;      
    }

    function nameToCoordinateDisplayType(name) {
      switch (name)
      {
      case constants.LatLong: return vss.common.EnumCoordDisplayType.LAT_LONG;
      case constants.DMS: return vss.common.EnumCoordDisplayType.DMS;
      case constants.NE: return vss.common.EnumCoordDisplayType.NE;
      default: return vss.common.EnumCoordDisplayType.NO_COORDS;
      }
    }

    function refreshUrl(args) {
        wmsUrl = args[0];
        var params = jQuery.extend({}, constants.WMS_PARAMS, args[1]);
        jQuery.extend(params, { REQUEST: "GetMap",
                                WIDTH: constants.TILE_SIZE,
                                HEIGHT: constants.TILE_SIZE });
        for (var p in params) {
            if (params.hasOwnProperty(p)) {
                wmsUrl += "&" + p + "=" + params[p];
            }
        }
        if (wmsLayerVisible && is3D) {
            if (map.overlayMapTypes.length > 0) {
                map.overlayMapTypes.removeAt(constants.WMS_INDEX);
            }           
            map.overlayMapTypes.insertAt(constants.WMS_INDEX, wmsMapType);
        }
    }
    
    function addDxfFiles(args) {
        VLDxfLayers.addDxfFiles(args[0], args[1], args[2], projection);
    }
    
    function deleteDxfFiles(dxfFileList) {
        VLDxfLayers.deleteDxfFiles(dxfFileList);
    }

    function updateDxfFile(args) {
        VLDxfLayers.updateDxfFile(args[0]);
    }


    function toggleMapItems(args) {        
        var pageTypeId = args[0];
        is3D = pageTypeId == vss.common.EnumApplicationPageType.THREED_MONITORING_PAGE;
        if (is3D) {            
            //Turn on 3D layer
            map.overlayMapTypes.setAt(constants.WMS_INDEX, wmsLayerVisible ? wmsMapType : null);
        }
        else  {
            //Turn off 3D layer
            map.overlayMapTypes.setAt(constants.WMS_INDEX, null);
        }

        VLProjectFilterBoundary.toggleBoundariesVisibility(map, is3D);
        VLSitePolygon.toggleMonitoredSiteVisibility(pageTypeId);
        VLMapInfoControl.showToolsMenuItem(constants.PRODUCTION_DATA_TOOL, is3D);
        VLMapInfoControl.showToolsMenuItem(constants.CELL_DETAILS_TOOL, is3D);
        VLMapInfoControl.showToolsMenuItem(constants.FILL_TOOL, is3D);
    }

    function clearAssetMarkers() {
      VLAssetMarker.clearMapMarkers();
      assetMarkers = null;
      if (clustererForAssetMarkers != null)
      {
        clustererForAssetMarkers.clearMarkers();
        clustererForAssetMarkers = null;
      }
      if (assetMarkerInfoWindow != null)
      {
	    assetMarkerInfoWindow.closeExistingInfoWindow();
      }
    }
    
    function addAssetMarkers(assetList) {
      if (assetList.length > 0)
      {
        if (assetMarkerInfoWindow == null)
        {
          assetMarkerInfoWindow = new vss.controls.MapInfoWindow(true);
        }
        assetMarkers = VLAssetMarker.createAssetMarkers(map, assetList, assetMarkerInfoWindow);
        clustererForAssetMarkers = new MarkerClusterer(map, assetMarkers, constants.MARKER_CLUSTERER_OPTIONS);
          //Hide assets if off in menu
          if (!toolsMenuState.isAssetsTool) {
              VLAssetMarker.toggleAssetMarkerVisibility(toolsMenuState.isAssetsTool);
          }

      }       
    }
    
    function clearSitePolygons() {
      VLSitePolygon.clearSitePolygons(); 
    }
       
    function addSitePolygons(siteList) {       
        if (siteList.length > 0) {
            VLSitePolygon.addSitePolygons(map, siteList);
        }
    }
    
    function clearProjectPolygons() {
      VLSitePolygon.clearProjectPolygons(); 
    }
       
    function addProjectPolygons(siteList) {       
        if (siteList.length > 0) {
            VLSitePolygon.addProjectPolygons(map, siteList);
        }
    }
    
    function clearMonitoredSites() {
      VLSitePolygon.clearMonitoredSites(); 
    }
       
    function addMonitoredSites(siteList) {       
        VLSitePolygon.addMonitoredSites(siteList);
    }
    
    function selectMonitoredSites(args) {       
        VLSitePolygon.selectMonitoredSites(args[0], args[1]);
    }
     
    function addMassHaulSiteAreas(siteAreas) { 
        if (siteAreas.length > 0) {       
            VLSitePolygon.addMassHaulSiteAreas(siteAreas);
        }
    } 
 
    function clearMassHaulSiteAreas() {       
        VLSitePolygon.clearMassHaulSiteAreas();
    } 
    
    function addLoadDumpMarker(args) {
        VLLoadDumpMarker.addLoadDumpMarker(map, args[0], args[1], args[2], args[3]);
    }
    
    function addLoadDumpPolyline(args) {
        VLLoadDumpMarker.addLoadDumpPolyline(map, args[0], args[1]);
    }
    
    function clearLoadDumpMarkersAndPolylines() {
        VLLoadDumpMarker.clearLoadDumpMarkersAndPolylines(map);
    }    
 
    function drawLegend(args) {       
        if (!loading) {               
            VLProjectMapLegend.drawLegend(map, args[0], args[1]);
        }
    }
    
    function drawFilterBoundary(args) {
        VLProjectFilterBoundary.drawBoundary(map, args[0], args[1]);
    }
    
    function deleteFilterBoundary(args) {
        VLProjectFilterBoundary.deleteBoundary(args[0]);
    } 
    
    function drawAlignmentProfileLine(args) {
        VLAlignmentProfile.drawPolyline(map, args[0]);
    }
    
    function deleteAlignmentProfileLine() {
        VLAlignmentProfile.deletePolyline();
    }         

    function setCenterAndZoom(args) {
        var latLng = new google.maps.LatLng(args[0], args[1]);
        map.setCenter(latLng);
        map.setZoom(args[2]);
    }
    
    function getMapState() {
        var center = map.getCenter();
        return { 
            zoom: map.getZoom(),
            centerLat: center.lat(),
            centerLng: center.lng(),
            toolsMenu: toolsMenuState
        };
    }
    
    function setMapState(args) {   
        var state = args[0];
        map.setZoom(state.zoom);
        var latLng = new google.maps.LatLng(state.centerLat, state.centerLng);
        map.setCenter(latLng); 
        toolsMenuState = state.toolsMenu;
        //Coordinates
        VLMapInfoControl.updateCoordsMenuSelection(toolsMenuState.coordsSelection);
        //Assets
        VLMapInfoControl.updateToolsMenuSelection(constants.ASSETS_TOOL, toolsMenuState.isAssetsTool);       
        VLAssetMarker.toggleAssetMarkerVisibility(toolsMenuState.isAssetsTool);
        //Production data
        VLMapInfoControl.updateToolsMenuSelection(constants.PRODUCTION_DATA_TOOL, toolsMenuState.isProductionDataTool);       
        wmsLayerVisible = toolsMenuState.isProductionDataTool;
        map.overlayMapTypes.setAt(constants.WMS_INDEX, wmsLayerVisible ? wmsMapType : null);
        //Cell Details
        VLMapInfoControl.updateToolsMenuSelection(constants.CELL_DETAILS_TOOL, toolsMenuState.isCellDetailsTool);
        VLMapInfoControl.enableToolsMenuItem(constants.CELL_DETAILS_TOOL, wmsLayerVisible);
        //Site Fill
        VLMapInfoControl.updateToolsMenuSelection(constants.FILL_TOOL, toolsMenuState.isFillTool);       
        VLSitePolygon.toggleSitePolygonsOpacity(toolsMenuState.isFillTool);
        //Measure Tool
        VLMapInfoControl.updateToolsMenuSelection(constants.MEASURE_TOOL, toolsMenuState.isMeasureTool);
        //tool is restarted from Flex       
        //Area Tool
        VLMapInfoControl.updateToolsMenuSelection(constants.AREA_TOOL, toolsMenuState.isAreaTool);              
         //tool is restarted from Flex
        sendCoordinates = toolsMenuState.coordsSelection != constants.NoCoords || toolsMenuState.isCellDetailsTool;
    }
    
    function getMapBounds() {
        var bounds = map.getBounds();
        var min = bounds.getSouthWest();
        var max = bounds.getNorthEast();
        return { minLat: min.lat(), minLng: min.lng(), maxLat: max.lat(), maxLng: max.lng() };
    }
    
    function onTilesLoaded() {        
        if (loading) {
            loading = false;
            formMapTypes();
            tilesLoaded();                             
        }
    }
    
    function onZoomChanged() {        
        mapZoomChanged(map.getZoom());
    }
    
    function onTiltChanged() {
        if (map.getTilt() == 45)
          map.setTilt(0);
    }
    
    function onMouseMove(evt) {
        if (!loading) {
            //IE9 sends multiple mouse move events when there is no movement. Workaround to check that the mouse actually moved from the last point
            if (lastMouseMovePosition == null || !lastMouseMovePosition.equals(evt.latLng)) {
                lastMouseMovePosition = evt.latLng;
                //Only send map mouse positions if requested and user is currently inside map
                if (insideMap && sendCoordinates) {
                    mapCoordsChanged(evt.latLng.lat(), evt.latLng.lng());
                }
                tooltipMouseMoved(evt.latLng);
            }
        }
    }
    
    function onMouseOut(evt) {
        insideMap = false;
        if (!loading) {
            //mapCoordsChanged(null, null); //tell VL client to clear coords since outside map
            hideTooltip();
        }
    }
    
    function onMouseOver(evt) {
        insideMap = true;
        if (!loading) {
            mapCoordsChanged(evt.latLng.lat(), evt.latLng.lng());
        }
    }
    
    function onKeyDown(evt) {
        if (evt.keyCode === 27) { // Esc key
            //Esc kills tools
            escapeKeyPressed(); //calls flex
        }
    }    
 
    function changeMapType(value)
    {
        util.switchMapType(map,value);
        VLMapInfoControl.updateMapTypeMenuSelection(value);
    }   
    
    function hideNumberLabel() {
       if (numberLabel != null) {
            numberLabel.setMap(null);
            numberLabel = null;
        }    
    }
    
    function showNumberLabel(displayNumber, position) {
        if (numberLabel == null) {
            numberLabel = new MarkerWithLabel({
              icon: {
                url: 'images/ProfileIndicator.png',
                size: new google.maps.Size(0, 0)
                }, //Google does not support empty icon anymore. So create an icon with 0,0 dimensions
                draggable: false,
                clickable: false,
                visible: true,
                labelVisible: true,
                labelAnchor: new google.maps.Point(50, 10),//center label width 100 height 20
                labelClass: "toolLabels" //CSS class for labels
            });
            numberLabel.setMap(map);
        }
        numberLabel.setOptions({
            labelContent: displayNumber,
            });
        numberLabel.setPosition(position);
    }
    
    function updateProfileMarker(args) {
       if (profileMarker == null) {
              var markerIcon = {
                url: "images/ProfileIndicator.png",
                anchor: new google.maps.Point(constants.PROFILE_MARKER_SIZE/2, constants.PROFILE_MARKER_SIZE/2),
                scaledSize: new google.maps.Size(constants.PROFILE_MARKER_SIZE, constants.PROFILE_MARKER_SIZE)            
                };
                    
            profileMarker = new google.maps.Marker({
              icon: markerIcon,
              map: null,//hide until required
            });
        }           
        var profileMap = args[0] == true ? map : null;
        if (!isNaN(args[1]) && !isNaN(args[2])) {
            profileMarker.setPosition(new google.maps.LatLng(args[1], args[2]));
        }   
        if (profileMarker.getMap() != profileMap) {
            profileMarker.setMap(profileMap);
        } 
    }
    
    function startDrawAreaTool() {    
        VLDrawPolygon.startPolygonTool(map, constants.MAP_TOOL_COLOR, constants.MAP_TOOL_LINEWIDTH, constants.DRAW_CURSOR_URL, hideNumberLabel, onAreaComplete);       
        VLMapInfoControl.updateToolsMenuSelection(constants.AREA_TOOL, true);
    }
    
    function onAreaComplete(vertices) {
        var polyBounds = new google.maps.LatLngBounds();
        for (var i=0; i<vertices.length; i++) {
            polyBounds.extend(vertices[i]);
        }
        var polyCenter = polyBounds.getCenter();
        var areaSqMeters = google.maps.geometry.spherical.computeArea(vertices);
        //Get VL client to convert to user units
        var displayArea = formatDisplayArea(areaSqMeters);
        showNumberLabel(displayArea, polyCenter);
    }
    
    function stopDrawAreaTool() {
        hideNumberLabel();
        VLDrawPolygon.endPolygonTool();
        VLMapInfoControl.updateToolsMenuSelection(constants.AREA_TOOL, false);
    }
    
    function startDrawPolygonTool() {
         VLDrawPolygon.startPolygonTool(map, constants.FILTER_TOOL_COLOR, constants.FILTER_TOOL_LINEWIDTH, constants.DRAW_CURSOR_URL, null, onPolygonComplete);           
    }
    
    function onPolygonComplete(vertices) {
        polygonComplete(VLMapUtil.latLngsToString(vertices));
    }
    
    function stopDrawPolygonTool() {
           VLDrawPolygon.endPolygonTool();
    } 
    
    function startDrawLineTool() {
        VLProfileSlicer.startLineTool(map);
    } 
 
    function stopDrawLineTool(args) {
        VLProfileSlicer.endLineTool(args[0]);
    }      
    
   function startDrawMeasureTool() { 
        VLMeasureTool.startLineTool(map, hideNumberLabel, onMeasureComplete, onMeasureComplete);       
        VLMapInfoControl.updateToolsMenuSelection(constants.MEASURE_TOOL, true);
   }
    
   function onMeasureComplete(vertices) {
        var centerLat = vertices[0].lat() + (vertices[1].lat() - vertices[0].lat())/2;
        var centerLng = vertices[0].lng() + (vertices[1].lng() - vertices[0].lng())/2;
        var lineCenter = new google.maps.LatLng(centerLat, centerLng);
        var distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(vertices[0], vertices[1]);
        //Get VL client to convert to user units
        var displayDistance = formatDisplayDistance(distanceMeters,2);
        showNumberLabel(displayDistance, lineCenter);
    }
    
    function stopDrawMeasureTool() {
        hideNumberLabel();
        VLMeasureTool.endLineTool();
        VLMapInfoControl.updateToolsMenuSelection(constants.MEASURE_TOOL, false);
    }    
    
    //Tooltip functionality
    function showTooltip(text, point) {
        if (tooltip == null) {
            tooltip = new CustomToolTip({ labelClass: "projectToolTipLabel" });
            tooltip.setOptions({ map: map });
        }
        tooltip.draw(point, text);
        if (tooltipTimerHintExpired != null) {
            clearTimeout(tooltipTimerHintExpired);
        }
        tooltipTimerHintExpired = setTimeout(hideTooltip, 3000);
    }
    
    function hideTooltip() {
        if (tooltip != null) {
            tooltip.hide();
        }
        if (tooltipTimerMousePaused != null)
        {
            clearTimeout(tooltipTimerMousePaused);
            tooltipTimerMousePaused = null;
        }
    }
    
    function textForTooltipAtPoint(point) {
        var text = VLAlignmentProfile.textForTooltipAtPoint(point);
        if (text == null) {
            text = VLSitePolygon.textForTooltipAtPoint(point, false);
            if (text == null) {
                text = VLProjectFilterBoundary.textForTooltipAtPoint(point);
                if (text == null) {
                    text = VLSitePolygon.textForTooltipAtPoint(point, true);
                }
            }
        }
        return text;
    }
    
    function tooltipDueAtPoint(point) {
      var text = textForTooltipAtPoint(point);
      if (text == null) {
          hideTooltip();
      } else {
          showTooltip(text, point);
      }
    }
    
    function tooltipMouseMoved(point) {
        hideTooltip();
        if (point != null) {
            tooltipTimerMousePaused = setTimeout( function () { tooltipDueAtPoint(point); }, 600);
        }
    }
    
    function refreshMarkerInfoWindow()
	{
		var openedInfoWindowAsset = assetMarkerInfoWindow.getSelectedAssetData();
		if(openedInfoWindowAsset != null && assetMarkerInfoWindow.infoBox != null)
		{
			assetMarkerInfoWindow.closeExistingInfoWindow();
			assetMarkerInfoWindow.createInfoWindow(map,openedInfoWindowAsset);
		}
	}
