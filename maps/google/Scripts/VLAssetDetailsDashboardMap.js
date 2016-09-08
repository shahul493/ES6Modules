'use strict';	   
  	var vlSite;
  	var marker = null;  
     
    function mapInitialized()
    {
      google.maps.event.addListener(map, "mousemove", onMouseMove);
  	  google.maps.event.addListener(map, "mouseout", onMouseOut); 
      vlSite = new VLSite(map);
      mapReady();
    } 
    
    function addDetailsMarker(_detailsLocationWidgetData)
    {    
    	var myLatlng;
    	var lat = _detailsLocationWidgetData[0].latitude;
   		var lan = _detailsLocationWidgetData[0].longitude;
   		if(!isNaN(lat) && !isNaN(lan))
   		{
   		 	myLatlng = new google.maps.LatLng(lat,lan);
   		 	if(marker != null || marker != undefined)
   		 		marker.setPosition(myLatlng);
   		 	else
   		 	{
	   			marker = new google.maps.Marker({
		            position: myLatlng, 
		            map: map,
		            icon: new google.maps.MarkerImage('images/zoneBalloon.png',	new google.maps.Size(19, 24),new google.maps.Point(0,0), new google.maps.Point(6,24) ),
	        	});
        	}
        	VLMapUtil.setMapCenter(map,[marker],constants.MAX_ZOOM_ON_SEARCH);
   		}
    }  
    
    function addSitePolygons(siteList) {          	        
        vlSite.clearSitePolygons();        
        if (siteList.length > 0) { 
           vlSite.addSitePolygons(siteList);           
        }
    }
     