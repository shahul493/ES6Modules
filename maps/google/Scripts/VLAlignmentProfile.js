(function (namespace, $, undefined) {

    var profileLine = null;
    var tooltipText = null;
    

  namespace.drawPolyline = function(map, points) {

      //For safety, in case deleteLine hasn't been called for the old one if it exists....
      VLAlignmentProfile.deletePolyline();
      
      if (points != undefined && points != null) {
          var coords = VLMapUtil.sitePointsToLatLng(points); 

          var polyline = new google.maps.Polyline({
              map: map,
              editable: false,
              draggable: false,
              clickable: false,
              path: coords,
              strokeColor: 'red',
              strokeOpacity: 1,
              strokeWeight: 3,
              zIndex: 999 //make sure it's on top
          });
          profileLine = polyline; 
       } 
  };
  
   namespace.deletePolyline = function() {
 
        if (profileLine != null) {
            google.maps.event.clearInstanceListeners(profileLine);
            profileLine.setMap(null);
            profileLine = null;
        }
  };
  
  namespace.textForTooltipAtPoint = function(point) {
      if (profileLine == null || VLMapUtil.findPolygonWithEdgeAtPoint(point, [profileLine]) == null) {
          return null;
      } else {
          if (tooltipText == null) {
              tooltipText = getString('profileLine');
          }
          return tooltipText;
      }
  }
  
 
} (window.VLAlignmentProfile = window.VLAlignmentProfile || {}, jQuery));