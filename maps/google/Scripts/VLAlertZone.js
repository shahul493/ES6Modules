(function (namespace, $, undefined) {
  
  namespace.editZone = function (map) {
  
  var map = map, 
  lastClickTime, 
  clckTimeOut, 
  circles = [], 
  active_circle = null, 
  loaded = false,  
  drawZoneVisible,
  markerResetNeeded = false; 
 

		    
		    google.maps.event.addListener(map, "click", function (mapCanvas) {
		        mapClick(mapCanvas.latLng)
		    });
		    google.maps.event.addListener(map, "dblclick", function (mapCanvas) {
		        mapClick(mapCanvas.latLng)
		    });
		    
		    loaded = true;
		     
		function mapClick(clickPosition) {
		    var b = (new Date).getTime();
		    if (10 > b - lastClickTime) return 0;
		    lastClickTime = b;
		    clckTimeOut ? (window.clearTimeout(clckTimeOut), clckTimeOut = null) : clckTimeOut = window.
		    setTimeout(function () {
		        singleClick(clickPosition)
		    }, 500)
		}
		
		function singleClick(clickPosition) {
		    window.clearTimeout(clckTimeOut);
		    clckTimeOut = null;
		    createCircleTool(map, clickPosition, "Circle #" + circles.length)
		}
		
		function createCircleTool(widgetMap, clickPosition, widgetName, r) {
		/* disable the multiple circle creation as we using this for only single zone creation*/
			if(!circles.length)
			{
				onDrawModeVisible(true);
				var c = new DistanceWidget(widgetMap, clickPosition, widgetName, r);
				google.maps.event.addListener(c, "distance_changed", function () {
					updateSelection(c);
				});
				google.maps.event.addListener(c, "position_changed", function () {
					 
				});
				circles.push(c);
				active_circle && active_circle.set("active", false);
				active_circle = c;
				updateSelection(c);				
				loaded && 1 == circles.length && zoomToAllCircles()
		
		
				var removeControlDiv = document.createElement('div');
				this.removeControl = new CustomButtonControl(removeControlDiv, getString('removeNewZone'), map);
				this.removeControlListener = google.maps.event.addDomListener(removeControlDiv, 'click', function () {deleteActiveCircle()});
				this.removeControl.show();
			}
		}
		
		function DistanceWidget(widgetMap, clickPosition, widgetName, r) {
		    this.set("map", widgetMap);
		    this.set("position", clickPosition);
		    this.set("active", true);
		    this.set("name", widgetName);
		    
		    var centerIcon = {
	        url: 'images/pin_red.png',
	        origin: new google.maps.Point(0, 0),
	        anchor: new google.maps.Point(9, 23)
    		};
    		
		    centerMarker = new google.maps.Marker({
		        draggable: true,
		        icon:centerIcon});
		    centerMarker.bindTo("map", this);
		    centerMarker.bindTo("position", this);
		    radius = r ? r : getInputRadius();
		    radWidget = new RadiusWidget(radius);
		    this.set("radiusWidget", radWidget);
		    radWidget.bindTo("map", this);
		    radWidget.bindTo("active", this);
		    radWidget.bindTo("center", this, "position");
		    this.bindTo("distance", radWidget);
		    this.bindTo("bounds", radWidget);
		    var c = this;
		    google.maps.event.addListener(centerMarker, "click", function () {
		        active_circle.set("active", false);
		        c.set("active", true);
		        active_circle = c
		    });
		    google.maps.event.addListener(centerMarker, "dragend", function () {
		        active_circle.set("active", false);
		        c.set("active", true);
		        active_circle = c
		        updateSelection(c);
		    })
		}
		DistanceWidget.prototype = new google.maps.MVCObject;
		
		function RadiusWidget(r) {
		    var circle = new google.maps.Circle({
		        strokeWeight: 1,
		        strokeColor: getStrokeColor(),
		        clickable: false,
		        fillOpacity:0
		    });
		    this.set("circle",circle);
		    this.set("distance", r);
		    this.bindTo("bounds", circle);
		    circle.bindTo("center", this);
		    circle.bindTo("map", this);
		    circle.bindTo("radius", this);
		    this.addSizer_()
		}
		RadiusWidget.prototype = new google.maps.MVCObject;
		RadiusWidget.prototype.distance_changed = function () {
		    this.set("radius", this.get("distance"))
		};
		RadiusWidget.prototype.addSizer_ = function () {
			var radiusIcon = {
	        url: 'images/pin_green.png',
	        origin: new google.maps.Point(0, 0),
	        anchor: new google.maps.Point(9, 23)
    		};
		    var radiusMarker = new google.maps.Marker({
		        map: this.get("map"),
		        draggable: true,
		        icon:radiusIcon
		    });
		    this.set("sizer", radiusMarker);
		    radiusMarker.bindTo("map",this);
		    radiusMarker.bindTo("position", this, "sizer_position");
		    radiusMarker.bindTo("active", this);
		    var b = this;
		    google.maps.event.addListener(radiusMarker, "dragend", function () {
		        b.setDistance()
		        if(markerResetNeeded)
				this.setPosition(getRadiusLatLng(b));
		    });
		    //google.maps.event.addListener(a, "active_changed", function () {b.get("active") ? b.showSizer() : b.hideSizer()})
		};
		
		function getRadiusLatLng(b){
			var posToMove = getEarthRadiusLatLng(b.get("center"),b.get("distance"));
			var cLng = b.get("center").lng() + (posToMove.lng() * Math.cos(0));
			var cLat = b.get("center").lat() + (posToMove.lat() * Math.sin(0));		
			return new google.maps.LatLng(cLat, cLng);
		}
		
		function getEarthRadiusLatLng(originLatLng, distanceFromOriginalInMeters)
		{
			var lat = originLatLng.lat();
			var lng = originLatLng.lng();
		
			var degreesToRadiens = Math.PI / 180;
			var radiensToDegrees = 180 / Math.PI;
		
			var cLat= distanceFromOriginalInMeters / constants.EARTHS_RADIUS_IN_METERS * radiensToDegrees;
			var cLng= cLat/Math.cos(lat * degreesToRadiens);
		
			return new google.maps.LatLng(cLat, cLng);
		}
		RadiusWidget.prototype.center_changed = function () {
		    var a = this.get("bounds");
		
		    a && (a = a.getNorthEast().lng(),
		    a = new google.maps.LatLng(this.get("center").lat(), a),
		    this.set("sizer_position", a));
		
		};
		RadiusWidget.prototype.distanceBetweenPoints_ = function (a, b) {
		   var rdistance =  !a || !b ? 0 : d = google.maps.geometry.spherical.
		    computeDistanceBetween(a, b)
		    markerResetNeeded = false;
		    if(rdistance < constants.MIN_ZONE_RADIUS_IN_METERS)
		    {
		    	rdistance = constants.MIN_ZONE_RADIUS_IN_METERS;
		    	markerResetNeeded = true;
			}
		    if(rdistance > constants.MAX_ZONE_RADIUS_IN_METERS)
		    {
				rdistance = constants.MAX_ZONE_RADIUS_IN_METERS;
				markerResetNeeded = true;
			}
		    return rdistance;
		};
		RadiusWidget.prototype.setDistance = function () {
		    var a = this.get("sizer_position"),
		        b = this.get("center"),
		        a = this.distanceBetweenPoints_(b, a);
		    this.set("distance", a);
		};
		
		function updateSelection(a) {
			var zoneObj = {"centerLat":a.get("position").lat(),"centerLon":a.get("position").lng(),"radiusInMeters":a.get("distance").toFixed(2)};
			zoneMapDragChange(zoneObj);		    
		}
		
		function getInputRadius() {
			if(map.getZoom() < 2)
				map.setZoom(2);
			
			var bounds = map.getBounds();
		    var ne = bounds.getNorthEast();
		    var sw = bounds.getSouthWest();
		    var nw = new google.maps.LatLng(ne.lat(), sw.lng())
		    var x = google.maps.geometry.spherical.computeDistanceBetween(ne, nw);
		    var y = google.maps.geometry.spherical.computeDistanceBetween(sw, nw);
		    
		   var radius = Math.min(x, y)/4;
		   
		   if(radius < constants.MIN_ZONE_RADIUS_IN_METERS)radius = constants.MIN_ZONE_RADIUS_IN_METERS;
		   if(radius > constants.MAX_ZONE_RADIUS_IN_METERS)radius = MAX_ZONE_RADIUS_IN_METERS;
		   
		   return radius;
		}
		
		function getStrokeColor() {		    
		    return constants.NEW_ZONE_BORDER_COLOR;
		}
		 
		function deleteActiveCircle() {
		    if (active_circle) {
		        active_circle.set("map", null);
		        len = circles.length;
		        for (i = 0; i < len; i++) active_circle == circles[i] && (circles.splice(i, 1), active_circle = null)
		    }
		    this.removeControl.hide();
		    onDrawModeVisible(false);
		}
		 
		function zoomToAllCircles() {
		    data = [];
		    map.fitBounds(circles[0].get("radiusWidget").get("bounds"))
		}
		function onDrawModeVisible(isVisible)
		{
			sendZoneDrawMode(isVisible);
		}

}

} (window.VLAlertZone = window.VLAlertZone || {}, jQuery));
