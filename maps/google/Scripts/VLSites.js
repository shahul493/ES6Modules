"use strict";
function VLSite(map) {
  this.map_ = map;
  this.sitePolygons = [];
  this.sites = [];
  this.siteBoundaryPolygons = [];
  this.toolTipControl = null;
  this.customToolTip = null;
  this.siteStyleOptions = {};
  this.setDefaultPolygonStyle();
  this.isEditMode = false;
  this.dotMarker = null;
  //callback methods
  this.polyPointsChanged = null;
  this.maxPolypointReached = null;
  this.siteTypeID =  vss.common.EnumSiteType.GENERIC_SITE;
  this.selectedSiteID = -1; 
};

VLSite.prototype.initToolTip = function () {

  if (this.customToolTip == null) {
    this.customToolTip = new CustomToolTip({ labelClass: "toolTipLabel" });
    this.customToolTip.setOptions({ map: this.map_ });
  }
};

VLSite.prototype.addSitePolygons = function (sites) { 
  this.clearSitePolygons();
  this.sites = sites;
  for (var i = 0; i < sites.length; i++) {
    var site = this.sites[i];   
    var sitePolygon = this.addPolygon(site.ID, site.siteTypeID, site.name, site.polygon.source, site.color, site.transparent, i);
    this.sitePolygons.push(sitePolygon);
  }
};

VLSite.prototype.clearSitePolygons = function () {  
  this.clearPolygons(this.sitePolygons);  
  this.sitePolygons = [];
};

VLSite.prototype.getSitePolygon = function (id) {

  if (this.tempSite != null && this.tempSite.mapItemID == id)
    return this.tempSite;

  for (var i = 0; i < this.sitePolygons.length; i++) {
    if (this.sitePolygons[i].mapItemID == id) {
      return this.sitePolygons[i];
    }
  }
  return null;

};

VLSite.prototype.updatePolygonWithStyle = function (id, options) {
  this.updateSiteStyleOptions(options);

  var currentPolygon = this.getSitePolygon(id);
  if (currentPolygon != null) {

    var siteColor = this.siteStyleOptions.siteColor;
    var fillOpacity = this.siteStyleOptions.transparent ? 0 : constants.SITE_FILL_OPACITY;    
    currentPolygon.setOptions({ fillColor: siteColor, fillOpacity: fillOpacity, strokeColor: siteColor });
  }

};

VLSite.prototype.updateSiteStyleOptions = function (options) {
  $.extend(this.siteStyleOptions, options);
}

VLSite.prototype.setDefaultPolygonStyle = function () {
  var options = { siteColor: "#000000", strokeWeight: constants.SITE_STROKE_WEIGHT, strokeOpacity: constants.SITE_STROKE_OPACITY, transparent: false };  
  $.extend(this.siteStyleOptions, options);
}

VLSite.prototype.zoomToCurrentSite = function (siteID) {
  var site = this.getSiteById(siteID);
  
  if(site == null){
   return;
   }
  var selectionLatSize = Math.abs(site.maxLat - site.minLat);
  var selectionLongSize = Math.abs(site.maxLon - site.minLon);

  var zoomLevel = 0;
  var latSize = 180.0;
  var longSize = 360.0;
  var _this = this;

  while (latSize > selectionLatSize && longSize > selectionLongSize && zoomLevel < constants.MAX_ZOOM) {
    zoomLevel++;
    latSize /= 2;
    longSize /= 2;
  }
  this.map_.setZoom(zoomLevel);
  var latLng = new google.maps.LatLng(site.minLat + selectionLatSize / 2, site.minLon + selectionLongSize / 2);
  this.map_.setCenter(latLng);  
};

VLSite.prototype.getSiteById = function(id){
  for (var i = 0; i < this.sites.length; i++) {
    if (this.sites[i].ID == id) {
      return this.sites[i];
    }
  }
  return null;
}; 
 
VLSite.prototype.drawDot = function (latLng) {

  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#005F07",
    fillOpacity: 1,
    scale: 2,
    strokeColor: "#005F07",
    strokeWeight: 1
  };

  var dotMarker = new google.maps.Marker({
    position: latLng,
    map: this.map_,
    icon: circle
  });
  return dotMarker;
};

VLSite.prototype.drawSitePolygon = function () {

  var polygon = null;
  var polyPath = new google.maps.MVCArray();

  var siteID = -1;
  var _this = this;

  var tooltipText = "";
  //the maximum number of points a site can have
  var max_num_points_for_site = 50;

  /*the threshold is 80% of the if the MAX_NUM_POINTS_FOR_SITE rounded
  if the user has added a number of points to the site equal or greater 
  than this threshold, we are going to display a countdown as they add points
  */
  var polygon_point_toolTip_visible_threshHold = max_num_points_for_site * 0.8;

  var removeControlDiv = document.createElement('div');
  this.removeControl = new CustomButtonControl(removeControlDiv, getString("removeLastPoint"), map);

  //enable polygon to be drawn on overlapping polygon
  this.isEditMode = true;  
  this.initToolTip();

  this.tempSite = null;  

  this.mapMouseMoveListener = google.maps.event.addListener(this.map_, "mousemove", function (event) {
    if (tooltipText != "") {
      _this.customToolTip.draw(event.latLng, tooltipText);
    }
    else {
      _this.customToolTip.hide();
    }
  });

  this.removeControlListener = google.maps.event.addDomListener(removeControlDiv, 'click', function () {    

    var index = polyPath.getLength();
    var latLong = polyPath.getAt(0);
    if (index > 1) {
      polyPath.removeAt(index -1);
    }
    else {
      clear();      
      _this.removeControl.hide();
    }
    updateMarkers(latLong);
    _this.customToolTip.hide();
    updateTooltipText();
    notifyPolyPointChange();
  });

  this.polyPointListener = google.maps.event.addListener(this.map_, "click", function (event) {	
    if (polyPath.getLength() >= max_num_points_for_site) {
      if (_this.maxPolypointReached != null) _this.maxPolypointReached();
      return;
    }

    polyPath.push(event.latLng);
    updateTooltipText();
    _this.removeControl.show();    
    updateMarkers(event.latLng);

    var siteColor = _this.siteStyleOptions.siteColor;
    var transparent = _this.siteStyleOptions.transparent;     
 	
    var len = polyPath.getLength();    
    if (len == 2) {

	    var polyOptions =
					{
				    map: this,
				    siteType: _this.siteTypdID,
				    transparent: transparent,
				    paths: polyPath,
				    mapItemID: siteID,
				    clickable: false            
				  	};
		var options = $.extend(polyOptions, VLMapUtil.siteOptions(_this.siteTypeID, siteColor, transparent));
	  	//Need at least 2 points to create google polygon
	  	polygon = new google.maps.Polygon(options);		  	
     
    }
    _this.tempSite = polygon;
    notifyPolyPointChange();
  });

  var clear = function () {

    if (polygon != null) {
      polygon.setMap(null);
    }
    polygon = null;

    if (polyPath != null) {
      polyPath.clear();
    }        
    _this.tempSite = null;
  };

  var updateMarkers = function (latlng) {

    if (polyPath.getLength() == 1) {
      if (_this.dotMarker == null) {
        _this.dotMarker = _this.drawDot(latlng);
      }
      else {
        _this.dotMarker.setMap(_this.map_);
        _this.dotMarker.setPosition(latlng);
      }
    }
    else {
      _this.dotMarker.setMap(null);
    }   

  };
  var notifyPolyPointChange = function () {
    if (_this.polyPointsChanged != null) _this.polyPointsChanged();
  };

  var updateTooltipText = function () {
    tooltipText = (polyPath.getLength() >= polygon_point_toolTip_visible_threshHold) ? polyPath.getLength().toString() + "/" + max_num_points_for_site.toString() : "";
  };
};

VLSite.prototype.cleanUpSiteEdit = function () {

  //Clean up the newly drawn dot marker and site if any
  if (this.tempSite != null) {
    this.tempSite.setMap(null);
    this.tempSite = null;
  }

  if (this.dotMarker != null) {
    this.dotMarker.setMap(null);
    this.dotMarker = null;
  }

  // this.clearSitePolygons();
  //this.setDefaultPolygonStyle();         

  if (this.removeControl != null)
    this.removeControl.RemoveFromMap(this.map_);

  if (this.removeControlListener != null)
    google.maps.event.removeListener(this.removeControlListener);

  if (this.polyPointListener != null)
    google.maps.event.removeListener(this.polyPointListener);

  if (this.mapMouseMoveListener != null)
    google.maps.event.removeListener(this.mapMouseMoveListener);

  this.removeControl = null;
  this.removeControlListener = null;
  this.polyPointListener = null;
  this.selectedSiteID = -1;
}

VLSite.prototype.getSitePolygonPath = function (id) {
  var currentPolygon = this.getSitePolygon(id);
  if (currentPolygon != null) {

    var polygonBounds = currentPolygon.getPath();
    var coordinates = [];

    for (var i = 0; i < polygonBounds.length; i++) {      
      coordinates.push(new google.maps.LatLng(polygonBounds.getAt(i).lat(), polygonBounds.getAt(i).lng()));      
    }

    return coordinates;
  }
  return null;
};

VLSite.prototype.intersectionsExistInSitePolygon = function (sitePolygonPoints) {

  //array containing all the lines that make up the polygon in order of user clicks
  var polyLines = [];

  //iterate through each point in the polygon creating the lines that make up the polygon
  for (var i = 0; i < sitePolygonPoints.length; i++) {
    //each array will contain 2 points: begin, end
    var line = [];
    //the begin point will always be 'n'
    line.push(sitePolygonPoints[i]);

    //the end point will either 'n+1' or the first point in the array 
    var next = i + 1;
    if (next > sitePolygonPoints.length - 1)
      next = 0;

    //upon determining the end point of the line add it to the line array
    line.push(sitePolygonPoints[next]);

    //add the line to polyLines
    polyLines.push(line);
  }
  for (var outer = 0; outer < polyLines.length - 1; outer++) {
    for (var inner = outer + 1; inner < polyLines.length; inner++) {
      //if the the 2 lines intersect return true
      if (this.intersect(polyLines[outer][0],
						              polyLines[outer][1],
						              polyLines[inner][0],
						              polyLines[inner][1]))
        return true;

    }
  }
  return false;
};

VLSite.prototype.intersect = function (line1Begin, line1End, line2Begin, line2End) {

  if ((line1Begin.lat() == line2Begin.lat() && line1Begin.lng() == line2Begin.lng()) ||
				    (line1Begin.lat() == line2End.lat() && line1Begin.lng() == line2End.lng()) ||
				    (line1End.lat() == line2Begin.lat() && line1End.lng() == line2Begin.lng()) ||
				    (line1End.lat() == line2End.lat() && line1End.lng() == line2End.lng()))
    return false;

  var denom = ((line2End.lat() - line2Begin.lat()) * (line1End.lng() - line1Begin.lng())) -
				    ((line2End.lng() - line2Begin.lng()) * (line1End.lat() - line1Begin.lat()));

  var nume_a = ((line2End.lng() - line2Begin.lng()) * (line1Begin.lat() - line2Begin.lat())) -
				    ((line2End.lat() - line2Begin.lat()) * (line1Begin.lng() - line2Begin.lng()));

  var nume_b = ((line1End.lng() - line1Begin.lng()) * (line1Begin.lat() - line2Begin.lat())) -
				    ((line1End.lat() - line1Begin.lat()) * (line1Begin.lng() - line2Begin.lng()));

  if (denom == 0.0) {
    if (nume_a == 0.0 && nume_b == 0.0)
      return true; // lines are one on top of the other, ie COINCIDENT
    return false; // these lines are in fact PARALLEL
  }

  var ua = nume_a / denom;
  var ub = nume_b / denom;

  if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
    return true; // the segments are INTERESECTING
  }

  return false;

};

VLSite.prototype.clearPolygons = function (polygons) {
  for (var key in polygons) {
     google.maps.event.clearInstanceListeners(polygons[key]);
     polygons[key].setMap(null);
  }
};

VLSite.prototype.clearSiteBoundaryPolygons = function () {
  this.clearPolygons(this.siteBoundaryPolygons);  
  this.siteBoundaryPolygons = [];
};

VLSite.prototype.selectSiteBoundaryPolygon = function (mapItem, centerMapItem) {  
  for (var i = 0; i < this.siteBoundaryPolygons.length; i++) {    
    if(this.siteBoundaryPolygons[i].mapItemID == mapItem.ID) {    
		this.siteBoundaryPolygons[i].setOptions({
				strokeWeight: constants.HIGHLIGHTED_STROKE_WEIGHT, 
			 	strokeColor: constants.HIGHLIGHTED_COLOR,
			 	strokeOpacity: 1
			 	});		
		//To do center the site
		if(centerMapItem)
			VLMapUtil.setPolygonCenter(this.map_, this.siteBoundaryPolygons[i]);		 
	}	
	else	
		this.siteBoundaryPolygons[i].setOptions({
				strokeWeight: constants.SITE_STROKE_WEIGHT, 
				strokeColor: mapItem.color,
				strokeOpacity: constants.SITE_STROKE_OPACITY
				});
  }  
};

VLSite.prototype.addSiteBoundaryPolygons = function (siteBoundariesList) {
  this.clearSiteBoundaryPolygons();

  for (var i = 0; i < siteBoundariesList.length; i++) {
    var site = siteBoundariesList[i];
    var mapItemID = site.ID;    
    var siteBoundaryPolygon = this.addPolygon(site.ID, site.siteTypeID, site.name, site.polygon.source, site.color, true, i);
    this.siteBoundaryPolygons.push(siteBoundaryPolygon);
  }

};

VLSite.prototype.addPolygon = function(siteID, siteTypeID, siteName, polypoints, color, transparent, zIndex){
  
  var siteColor = VLMapUtil.colorNumberToHexString(color);  
  var coords = [];

  for (var j = 0; j < polypoints.length; j++) {
    coords.push(new google.maps.LatLng(polypoints[j].lat, polypoints[j].lng));
  }
  this.initToolTip();

  var polyOptions =
  {
    map: this.map_,
    siteType: siteTypeID,
    transparent: transparent,
    editable: false,
    draggable: false,
    clickable: false,
    paths: coords,
    mapItemID: siteID,
    siteName: siteName,
    zIndex: zIndex,
    customToolTip: this.customToolTip
  };    
  var options;
  if (this.selectedSiteID == siteID) {
    if (this.isEditMode) {
      options = $.extend(polyOptions, VLMapUtil.siteOptions(siteTypeID, this.siteStyleOptions.siteColor, this.siteStyleOptions.transparent));
    }        
  }
  else {
    options = $.extend(polyOptions, VLMapUtil.siteOptions(siteTypeID, siteColor, transparent));
  }

  var sitePolygon = new google.maps.Polygon(options); 

  return sitePolygon;

};

VLSite.prototype.textForTooltipAtPoint = function (point) {
    var polygon = null;    
    var allPolygons = this.sitePolygons.concat(this.siteBoundaryPolygons);
    polygon = VLMapUtil.findPolygonAtPoint(point, allPolygons);
    if (polygon == null) {
      return null;
    } else {      
      return polygon.siteName + (polygon.siteType == vss.common.EnumSiteType.PROJECT_SITE ? "*" : "");
    }
};	