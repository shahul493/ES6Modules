(function (namespace, $, undefined) {

    namespace.colorNumberToHexString = function(colorNumber) { 
        //See http://stackoverflow.com/questions/9695687/javascript-converting-colors-numbers-strings-vice-versa
        //Also see http://stackoverflow.com/questions/6918943/substr-with-negative-value-not-working-in-ie
      // only run when the substr function is broken
      if ('ab'.substr(-1) != 'b') {
        /**
        *  Get the substring of a string
        *  @param  {integer}  start   where to start the substring
        *  @param  {integer}  length  how many characters to return
        *  @return {string}
        */
        String.prototype.substr = function (substr) {
          return function (start, length) {
            // did we get a negative start, calculate how much it is from the beginning of the string
            if (start < 0) start = this.length + start;

            // call the original function
            return substr.call(this, start, length);
          }
        } (String.prototype.substr);
      }
        return '#' + ('00000' + (colorNumber | 0).toString(16)).substr(-6);     
    }
    
    namespace.sitePointsToLatLng = function(pointsCollection) {
      if (pointsCollection != undefined && pointsCollection != null) {
          var points = pointsCollection.source; 
          var coords = [];
          for (var j = 0; j < points.length; j++) {
             coords.push(new google.maps.LatLng(points[j].lat, points[j].lng));
          }
          return coords;
       }
       return null;  
    }
    
    namespace.latLngsToString = function(vertices) {
       //Due to problems with Flex unable to recognise an Array of LatLng we'll convert to strings
        var list = "";
        for (var i=0; i<vertices.length; i++) {
            list += vertices[i].toUrlValue() + ";";         
        }
        //Remove trailing ";"
        return list.substr(0, list.length-1);    
    }
    

    
    namespace.setMapCenter = function(map,markers,maxZoom)
	{
		var validLatitudeDataCount = 0;
		var array = markers;
		var boundsObj = new google.maps.LatLngBounds(); 
		for(var i=0;i<array.length;i++)
		{
			if(markers[i].getPosition().lat() <= 85 && markers[i].getPosition().lat() >= -85 && markers[i].getPosition().lng() >= -180 && markers[i].getPosition().lng() <= 180)
			{
				validLatitudeDataCount++;
				boundsObj.extend(array[i].position);
			}
		}	
		if(array != null && array.length > 0)
		{
			if(validLatitudeDataCount > 0)
				map.fitBounds(boundsObj);
			else
			{
				map.setCenter(new google.maps.LatLng(0.0,0.0));
				map.setZoom(1);
			}	
		}
		if(maxZoom)
			setTimeout(function(){setMaxZoom(map,maxZoom)},200);
	}
	
	function setMaxZoom(map,maxZoom)
	{
	 if(map.getZoom() > maxZoom)
       {
          map.setZoom(maxZoom);
       }
	}
	
	namespace.getNormalizedCoord = function(coord, tileRange)
    {
      var y = coord.y;
      var x = coord.x;
            
      if (y < 0 || y >= tileRange) { return null; }
      if (x < 0 || x >= tileRange)
      {
        x = (x % tileRange + tileRange) % tileRange;
      }
      
      return { x: x, y: y };
    }
    
    function tileToLatLng(tileCoordinate, numTiles, projection) {
    
      var worldCoordinate = new google.maps.Point(
        tileCoordinate.x * constants.TILE_SIZE / numTiles,
        tileCoordinate.y * constants.TILE_SIZE / numTiles
      );
      var latLng = projection.fromPointToLatLng(worldCoordinate);
      return latLng;
    }
    
    namespace.tileBoundingBox = function(xTile, yTile, numTiles, projection) {
    
        var blCoord = new google.maps.Point(xTile, yTile + 1);
        var trCoord = new google.maps.Point(xTile + 1, yTile);
        var blLatLng = tileToLatLng(blCoord, numTiles, projection);
        var trLatLng = tileToLatLng(trCoord, numTiles, projection);
        return { blLat: blLatLng.lat(), blLng: blLatLng.lng(), trLat: trLatLng.lat(), trLng: trLatLng.lng() };
    }
    
   namespace.getMarkerIcon = function (colorVal){
	  var pinIcon = new google.maps.MarkerImage(
	    "http://chart.apis.google.com/chart?chst=d_map_xpin_letter_withshadow&chld=pin|%20|" + colorVal,
	    null, /* size is determined at runtime */
	    null, /* origin is 0,0 */
	    null, /* anchor is bottom center of the scaled image */
	    new google.maps.Size(19, 22)
		);
		return pinIcon;
  }
  
   namespace.siteOptions = function(siteType, siteColor, transparent) {
    return {
          strokeColor: siteType == vss.common.EnumSiteType.PROJECT_SITE ? constants.PROJECT_COLOR : siteColor,
          strokeOpacity: constants.SITE_STROKE_OPACITY,
          strokeWeight: siteType == vss.common.EnumSiteType.PROJECT_SITE ? constants.PROJECT_STROKE_WEIGHT : constants.SITE_STROKE_WEIGHT,
          fillColor: siteType == vss.common.EnumSiteType.PROJECT_SITE ? constants.PROJECT_COLOR : siteColor,
          fillOpacity: siteType == vss.common.EnumSiteType.PROJECT_SITE || transparent ? 0 : constants.SITE_FILL_OPACITY
          };
  }

  namespace.findPolygonAtPoint = function(point, polygons) {
   if (typeof polygons.length === 'number') {
      for (var n = polygons.length - 1; n >= 0; n--) { //polygons is an array
        var polygon = polygons[n];
        if (polygon.getVisible() && polygon.getMap() != null && google.maps.geometry.poly.containsLocation(point, polygon)) {
          return polygon;
        }
      }
    } else {
      for (var key in polygons) { //polygons is an object
        var polygon = polygons[key];
        if (polygon.getVisible() && polygon.getMap() != null && google.maps.geometry.poly.containsLocation(point, polygon)) {
          return polygon;
        }
      }
    }
    return null;
  }
  
  namespace.findPolygonWithEdgeAtPoint = function (point, polygons) {
      var tolerance = null;
      if (typeof polygons.length === 'number') {
          var distance = Number.MAX_VALUE;
          var closest_polygon;
          var zoom = 1;
          for (var n = polygons.length - 1; n >= 0; n--) { //polygons is an array
              var polygon = polygons[n];

              if (polygon.getVisible() && polygon.getMap() != null) {
                  zoom = polygon.getMap().getZoom();
                  var vertex_distance = Number.MAX_VALUE;
                  for (var vertex_index = polygon.getPath().length - 1; vertex_index >= 1; vertex_index--) {
                      var local_distance = google.maps.geometry.spherical.computeDistanceBetween(polygon.getPath().getAt(vertex_index), point);
                      if (vertex_distance > local_distance) vertex_distance = local_distance;
                  }

                  if (distance > vertex_distance) {
                      distance = vertex_distance;
                      closest_polygon = polygon;
                  }
              }
          }
          if (distance < 20)
              return closest_polygon;
      } else {
          for (var key in polygons) { //polygons is an object
              var polygon = polygons[key];
              if (tolerance == null) {
                  var map = polygon.getMap();
                  if (map) {
                      tolerance = Math.pow(map.getZoom(), -(map.getZoom() / 5));
                  }
              }
              if (polygon.getVisible() && polygon.getMap() != null) {
                  if (google.maps.geometry.poly.isLocationOnEdge(point, polygon, tolerance)) {
                      return polygon;
                  }
              }
          }
      }
      return null;
  }

  
   namespace.setPolygonCenter = function(map,polygon) {
	
	 var bounds = new google.maps.LatLngBounds();
     var paths = polygon.getPaths();
	 var path;        
	 for (var i = 0; i < paths.getLength(); i++) {
	    path = paths.getAt(i);
	    for (var ii = 0; ii < path.getLength(); ii++) {
	        bounds.extend(path.getAt(ii));
	    }
	 }
		        
	 map.fitBounds(bounds);
   };

    namespace.pixelToLatLng = function(map, px, py) {
        var proj = map.getProjection();//new MercatorProjection();
        var bounds = map.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var neWorld = proj.fromLatLngToPoint(ne);
        var swWorld = proj.fromLatLngToPoint(sw);
        var scale = 1 << map.getZoom();
        var worldPt = new google.maps.Point(px/scale + swWorld.x, py/scale + neWorld.y);
        var latLng = proj.fromPointToLatLng(worldPt);
        return latLng;
    };


} (window.VLMapUtil = window.VLMapUtil || {}, jQuery));