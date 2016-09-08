$(document).ready(function () {
    ALKMaps.MapServiceURL = "http://map.myvisionlink.cn:5909/apeimg/";
    var map = new ALKMaps.Map("mapTile", { displayProjection: new ALKMaps.Projection('EPSG:4326') });
    var cLon = 121.49843, cLat = 31.29923, zoom = 9;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Generate random data
    var lonLatList = [];
    var attributesList = [];
    var additionalInfo = [];
    for (var i = 0; i < 20; i++) {
        lonLatList.push(new ALKMaps.LonLat(cLon - Math.random() * 0.5, cLat - Math.random() * 0.5).transform(new ALKMaps.Projection("EPSG:4326"), map.getProjectionObject()));  // Transform degrees into meters.
        // lonLatList.push(new ALKMaps.LonLat(cLon, cLat).transform(new ALKMaps.Projection("EPSG:4326"), map.getProjectionObject())); 
        var externalGraphic = (i % 2) === 0 ? "../trimbleDemo/api/1.2/img/truck_green.png" : "../trimbleDemo/api/1.2/img/truck_red.png";

        // For popup window.
        attributesList.push({
            markerType: 'custom',  // For vector marker only.
            popupSize: new ALKMaps.Size(200, 120),
            // anchor: { size: new ALKMaps.Size(0, 0), offset: new ALKMaps.Pixel(-18, 20)},  // If it is not proivded, marker anchor will be used.
            overflow: 'auto',
            popupContentHTML: "<p><img src ='" + externalGraphic + "'> Tile goes here <br/>" +
                "<hr>" +
                "<b>Date Last Reported:</b>" + new Date().toDateString() + "<br/>" +
                "<b>VIN:</b>" + Math.floor((Math.random() * 1000000) + 1) + "<br/>" +
                "<b>Fuel(% remaining):</b>" + Math.floor((Math.random() * 100) + 1) + "%" + "<br/>" +
                "<b>Location:</b>" + Math.floor((Math.random() * 100) + 1) + " 上海, 中国" + "<br/>" +
                "<b>Last Known Status:</b>" + "Not Reporting" + "<br/>" +
                "<b>Open Alerts:</b>" + Math.floor((Math.random() * 100) + 1) + "<br/></p>"
        });

        additionalInfo.push({
            shortMsg: "<img src=\"" + externalGraphic + "\"/>" + Math.floor((Math.random() * 100) + 1) + "上海, 中国 Shanghai China",
            flagYellow: "<div class=\"flagYellow\"></div>"
        });
    }
    debugger
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    map.setCenter(new ALKMaps.LonLat(cLon, cLat).transform(new ALKMaps.Projection("EPSG:4326"), map.getProjectionObject()), zoom);
    var vssBaseMap = new ALKMaps.Layer.VSSBaseMap("VSS Base Map", null, { attribution: "VSSMAP COPYRIGHT", style: ALKMaps.STYLE.SATELLITE });
    var vlayer = new ALKMaps.Layer.Vector("Drawing Layer");
    var markerClusterStrategy = new ALKMaps.Strategy.MarkerCluster({ distance: 20, threshold: 2 });
    var markerLayer = new ALKMaps.Layer.Markers("Marker Layer", { attribution: "COPYRIGHT TEXT FOR MARKER LAYER", strategies: [markerClusterStrategy] });
    var layers = [vssBaseMap, vlayer, markerLayer];
    var vectorLayer = null;

    // // IF YOU DON'T WANT TO DRAW THE LOCATIONS ON THE MAP, COMMENT 2 LINES BELOW.
    vectorLayer = new ALKMaps.Layer.VectorMarkers("VectorMarkersLayer", { attribution: "COPYRIGHT INFORMATION FOR THIS LAYER." });
    vectorLayer.createMarkers(lonLatList, attributesList);
    if (vectorLayer) layers.push(vectorLayer);
    map.addLayers(layers);
    var markers = [];

    // // THE FOLLOWING LOOP SHOWS 3 WAYS TO CREATE MARKERS.
    for (var k = 0; k < lonLatList.length; k++) {

        var mkr = ALKMaps.Marker2.Anchored.topright(null, lonLatList[k], new ALKMaps.Size(140, 36), additionalInfo[k].shortMsg, { size: new ALKMaps.Size(0, 0), offset: new ALKMaps.Pixel(0, 0) },
                 {
                     size: new ALKMaps.Size(10, 36),
                     displayClass: "closeBox",
                     callback: function (e) { alert("Open console in Chrome to see more info."); console.log(e, this); } // Click the gray bar on the right side to see this.
                 },
                 attributesList[k]
         );
        mkr.autoSize = true; // Auto resize marker.

        markers.push(mkr);
    }

    // // After clustering and before adding markers to the layer, user can do more customization here.
    markerLayer.events.register('beforemarkeradded', this, function (event) {
        var myMarker = event.marker;
        if (myMarker.cluster) {
            if (myMarker.cluster.length > 1) {
                myMarker.contentSize = new ALKMaps.Size(52, 27);
                myMarker.contentHTML = "<div class=\"trimbleMarkerCluster\">" + myMarker.cluster.length + "</div>";
            }

        }
    });

    // // User needs to add all markers at once in order to perform clustering properly. It is very important.
    markerLayer.addMarkers(markers);


    $('#sat').click(function () { vssBaseMap.changeStyle(ALKMaps.STYLE["MONOCHROME"]); });

    $('#def').click(function () { vssBaseMap.changeStyle(ALKMaps.STYLE["DEFAULT"]); });

    // Get drawing data sets.
    // vlayer.features[index].geomery.components 
    // If degree is desirable, call transform function.

    // Methods for testing if two points of polygon interact
    // ALKMaps.Geometry.segmentsIntersect()
    // ALKMaps.Geometry.Polygon.intersects()
    
    //Arrow headed lines/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     var bearing = function(p1, p2) {
        var deltax = p2.x - p1.x;
        var deltay = p2.y - p1.y;
        var angleRad = Math.acos(deltay / Math.sqrt(deltax * deltax + deltay * deltay)) ;
        var angle = 360 / (2 * Math.PI) * angleRad;
        if (deltax < 0) {
            return 360 - angle;
        } else {
            return angle;
        }
    };
   
    var pointStyle = new ALKMaps.Style({
        strokeColor:  "#00FF00",
        fillColor: "#FF6600",
        fillOpacity: 0.8,
        pointRadius: 20, // Arrow size.
        strokeWidth: 1,
        graphicName: "chevron", //using ALK pre-defined graphic symbol of arrow
        rotation: "${rotation}"
    }, {
        context: {
            rotation: function (feature) {
                var heading = parseInt(feature.attributes.heading);
                return heading;
            }
       }
    });

    var pointStyleMap = new ALKMaps.StyleMap({
        default: pointStyle
    });
    
    var arrowLayer = new ALKMaps.Layer.Vector("Line With Arrow", {styleMap: pointStyleMap});
    map.addLayer(arrowLayer);
    var p1 = new ALKMaps.Geometry.Point(cLon - 1, cLat + 0.4).transform(new ALKMaps.Projection("EPSG:4326"), map.getProjectionObject());
    var p2 =  new ALKMaps.Geometry.Point(cLon - 0.75, cLat).transform(new ALKMaps.Projection("EPSG:4326"), map.getProjectionObject());
    
	var pointFeature = new ALKMaps.Feature.Vector( p2,
        { // Custom data goes here.
            heading:  bearing(p1, p2),
            speed: 55,
            fuel: 0.8
        }, 
        null
    );

    var lineFeature = new ALKMaps.Feature.Vector(
        new ALKMaps.Geometry.LineString([ p1, p2]),
        null, 
        { // Line style
            strokeColor: "#00FF00",
            strokeWidth: 5
        }
    );        
        
    arrowLayer.addFeatures([lineFeature, pointFeature]);    
});