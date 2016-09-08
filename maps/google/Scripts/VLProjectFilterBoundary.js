(function(namespace, $, undefined) {

  var filterBoundaries = [];
  var tooltipText = null;

  namespace.drawBoundary = function(map, id, points) {

    //For safety, in case deleteBoundary hasn't been called for the old one if it exists....
    VLProjectFilterBoundary.deleteBoundary(id);

    if (points != undefined && points != null) {
      var coords = VLMapUtil.sitePointsToLatLng(points);

      var polygon = new google.maps.Polygon({
        id: id,
        map: map,
        editable: false,
        draggable: false,
        clickable: false,
        paths: coords,
        strokeColor: 'red',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0,
        zIndex: 998 //make sure it's on top of sites             
      });
      filterBoundaries.push(polygon);
    }
  };

  namespace.deleteBoundary = function(id) {
    for (var i = 0; i < filterBoundaries.length; i++) {
      if (filterBoundaries[i].id == id) {
        google.maps.event.clearInstanceListeners(filterBoundaries[i]);
        filterBoundaries[i].setMap(null);
        filterBoundaries.splice(i, 1);
      }
    }
  };

  namespace.clearBoundaries = function() {
    for (var i = 0; i < filterBoundaries.length; i++) {
      google.maps.event.clearInstanceListeners(filterBoundaries[i]);
      filterBoundaries[i].setMap(null);
    }
    filterBoundaries = [];
};

    namespace.toggleBoundariesVisibility = function(map, visible) {
        for (var i = 0; i < filterBoundaries.length; i++) {
            filterBoundaries[i].setMap(visible ? map : null);
        }
    };
  
  namespace.textForTooltipAtPoint = function(point) {
    if (VLMapUtil.findPolygonWithEdgeAtPoint(point, filterBoundaries) == null) {
      return null;
    } else {
      if (tooltipText == null) {
        tooltipText = getString('filterBoundary');
      }
      return tooltipText;
    }
  }

  
 
} (window.VLProjectFilterBoundary = window.VLProjectFilterBoundary || {}, jQuery));