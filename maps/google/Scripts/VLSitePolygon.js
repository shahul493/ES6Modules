(function (namespace, $, undefined) {

    //Dictionaries indexed by name
    var sitePolygons = {};
    var sitePolygonArray = [];
    var projectPolygons = {};
    var projectMarkers = {};

    var monitoredSiteNames = [];
    var selectedSiteNames = [];
    var massHaulSiteAreaPolygons = [];

    var polyMap = null;
    var mapZoomListener = null;
    var projectsVisible = true;

    var Z_INDEX = { projects: 1, sites: 101, areas: 1001 };


    namespace.clearSitePolygons = function () {
        clearPolygons(sitePolygons);
        sitePolygons = {};
        sitePolygonArray = [];
    };

    namespace.clearProjectPolygons = function () {
        clearPolygons(projectPolygons);
        projectPolygons = {};
        clearMarkers(projectMarkers);
        projectMarkers= {};
    };

    function clearPolygons(polygons) {
        for (var key in polygons) {
            google.maps.event.clearInstanceListeners(polygons[key]);
            polygons[key].setMap(null);
        }
    }

    function clearMarkers(markers) {
        for (var key in markers) {
            google.maps.event.clearInstanceListeners(markers[key]);
            markers[key].setMap(null);
        }
    }

    namespace.clearMonitoredSites = function () {
        toggleSitePolygonSelection(false);
        selectedSiteNames = [];
        monitoredSiteNames = [];
    };

    namespace.toggleMonitoredSiteVisibility = function (pageTypeId) {
        //Hiding sites  
        toggleSitePolygonsVisibility(false, pageTypeId);
        
        if (pageTypeId != vss.common.EnumApplicationPageType.THREED_MONITORING_PAGE) {
            //Hide projects            
            toggleProjectPolygonsAndMarkersVisibility(false);

            //Show only monitored sites
            if (monitoredSiteNames) {
                for (var i=0; i<monitoredSiteNames.length; i++) {
                    if (sitePolygons[monitoredSiteNames[i]] && showSite(pageTypeId, monitoredSiteNames[i])) {
                        sitePolygons[monitoredSiteNames[i]].setMap(polyMap);
                    }
                    //projects don't have to be favorites - always show them
                    else if (projectPolygons[monitoredSiteNames[i]]) {
                        projectPolygons[monitoredSiteNames[i]].setMap(polyMap);
                    }
                }
                toggleSitePolygonSelection(true, pageTypeId == vss.common.EnumApplicationPageType.MASSHAUL_MONITORING_PAGE);
            }
        }
        else {
            //Restore normal sites
            toggleSitePolygonsVisibility(true, pageTypeId);
            toggleProjectPolygonsAndMarkersVisibility(true);

            //Unhighlight selected sites
            toggleSitePolygonSelection(false);
        }
        projectsVisible = pageTypeId == vss.common.EnumApplicationPageType.THREED_MONITORING_PAGE;
    }

    function showSite(pageTypeId, key) {
        return pageTypeId == vss.common.EnumApplicationPageType.MASSHAUL_MONITORING_PAGE || sitePolygons[key].isFavorite;
    }

   function toggleSitePolygonsVisibility(show, pageTypeId) {
        var map = show ? polyMap : null;
        for (var key in sitePolygons) {
            if (!show || showSite(pageTypeId, key)) {
                sitePolygons[key].setMap(map);
            }
        }
    }

    function toggleProjectPolygonsAndMarkersVisibility(show) {
        var map = show ? polyMap : null;
        var zoom = polyMap.getZoom();
        //Note keys in projectPolygons and projectMarkers match
        for (var key in projectPolygons) {
            if (zoom < projectMarkers[key].projectMarkerMaxZoom) {
                projectMarkers[key].setMap(map);
                projectPolygons[key].setMap(null);
            }
            else {
                projectMarkers[key].setMap(null);
                projectPolygons[key].setMap(map);
            }
        }
    }

    function onZoomChanged() {
        if (projectsVisible) {
            toggleProjectPolygonsAndMarkersVisibility(true);
        }
    }

    namespace.selectMonitoredSites = function (siteNames, fill) {
        toggleSitePolygonSelection(false);//Unselect previous selection
        selectedSiteNames = siteNames;
        toggleSitePolygonSelection(true, fill);
    }

    function toggleSitePolygonSelection(select, fill) {
        if (selectedSiteNames) {
            for (var i = 0; i < selectedSiteNames.length; i++) {
                var polygon;
                if (sitePolygons[selectedSiteNames[i]]) {
                    polygon = sitePolygons[selectedSiteNames[i]];
                }
                else if (projectPolygons[selectedSiteNames[i]]) {
                    polygon = projectPolygons[selectedSiteNames[i]];
                }
                if (polygon) {
                    var options;
                    if (select) {
                        options = {
                            strokeColor: constants.HIGHLIGHTED_COLOR,
                            strokeOpacity: 1,
                            strokeWeight: constants.HIGHLIGHTED_STROKE_WEIGHT,
                            fillColor: polygon.siteColor, //??? check this
                            fillOpacity: (fill ? 1 : 0)
                        };
                    }
                    else {
                        options = VLMapUtil.siteOptions(polygon.siteType, polygon.siteColor, polygon.transparent);
                    }
                    polygon.setOptions(options);
                }
            }
        }
    }

    namespace.addMonitoredSites = function (siteNames) {
        monitoredSiteNames = siteNames;
    };

    namespace.addSitePolygons = function (map, sites) {
        addPolygons(map, sites, sitePolygons, Z_INDEX.sites, sitePolygonArray);
    };


    namespace.addProjectPolygons = function (map, sites) {
        addPolygons(map, sites, projectPolygons, Z_INDEX.projects, null);
        addProjectMarkers(sites);
    };

    function addPolygons(map, sites, polygons, zStartIndex, polygonArray) {
        polyMap = map;

        var zIndex = zStartIndex;

        for (var i = 0; i < sites.length; i++) {
            var site = sites[i];
            var coords = VLMapUtil.sitePointsToLatLng(site.polygon);
            var siteColor = VLMapUtil.colorNumberToHexString(site.color);

            var polyOptions  = {
                map: map,
                siteType: site.siteTypeID,
                siteName: site.name,
                siteColor: siteColor,
                transparent: site.transparent,
                isFavorite: site.isFavorite,
                editable: false,
                draggable: false,
                clickable: false,
                paths: coords,
                zIndex: zIndex+i+1
            };
            var options = $.extend( polyOptions, VLMapUtil.siteOptions(site.siteTypeID, siteColor, site.transparent));
            var polygon = new google.maps.Polygon(options);

            //keep reference to polygon so we can delete it when needed
            polygons[site.name] = polygon;
            if (polygonArray != null) {
                polygonArray.push(polygon);
            }
        }
    };

    function addProjectMarkers(sites) {

        if (mapZoomListener == null) {
//TODO!! should the result of addListener be assigned to mapZoomListener??
            google.maps.event.addListener(polyMap, "zoom_changed", onZoomChanged);
        }

        for (var i = 0; i < sites.length; i++) {
            var site = sites[i];

            var minLatLng = new google.maps.LatLng(site.minLat, site.minLon);
            var maxLatLng = new google.maps.LatLng(site.maxLat, site.maxLon);
            var projectBounds = new google.maps.LatLngBounds(minLatLng, maxLatLng);
            //work out the zoom level at which to hide the icon and display the polygon
            var projection = polyMap.getProjection();
            var minWorldPt = projection.fromLatLngToPoint(minLatLng);
            var maxWorldPt = projection.fromLatLngToPoint(maxLatLng);
            var worldWidth = Math.abs(maxWorldPt.x - minWorldPt.x);
            var worldHeight = Math.abs(maxWorldPt.y - minWorldPt.y);
            var projectMarkerMaxZoom = 0;
            for (var z = 1; z < constants.MAX_ZOOM && projectMarkerMaxZoom == 0; z++) {
                var numTiles = 1 << z;
                var pixelWidth = worldWidth * numTiles;
                var pixelHeight = worldHeight * numTiles;
                var squaredLength = pixelWidth * pixelWidth + pixelHeight * pixelHeight;
                if (squaredLength > 100) {
                    projectMarkerMaxZoom = z;
                }
            }

            var markerIcon = {
                url: "images/icon_project_map.png",
                anchor: new google.maps.Point(10,11),
                scaledSize: new google.maps.Size(20,22)
            };

            var projectMarker = new google.maps.Marker({
                icon: markerIcon,
                map: null,//hide initially
                projectBounds: projectBounds,
                position: projectBounds.getCenter(),
                projectMarkerMaxZoom: projectMarkerMaxZoom
            });

            google.maps.event.addListener(projectMarker, 'click', function() {
                polyMap.fitBounds(this.projectBounds);
            });

            projectMarkers[site.name] = projectMarker;
        }
    }

    namespace.addMassHaulSiteAreas = function (siteAreas) {

        var zIndex = Z_INDEX.areas;

        for (var i = 0; i < siteAreas.length; i++) {
            var siteArea = siteAreas[i];

            var coords = VLMapUtil.sitePointsToLatLng(siteArea.polygon);

            var polyOptions  = {
                map: polyMap,
                siteName: siteArea.name,
                editable: false,
                draggable: false,
                clickable: false,
                paths: coords,
                zIndex: zIndex+i+1,
                strokeColor: constants.HIGHLIGHTED_COLOR,
                strokeOpacity: 1,
                strokeWeight: constants.SITE_STROKE_WEIGHT,
                fillOpacity: 0
                //no fillColor required as not filled
            };

            var polygon = new google.maps.Polygon(polyOptions);

            //keep reference to polygon so we can delete it when needed
            massHaulSiteAreaPolygons.push(polygon);
        }
    };

    namespace.clearMassHaulSiteAreas = function () {

        for (var i=0; i<massHaulSiteAreaPolygons.length; i++) {
            google.maps.event.clearInstanceListeners(massHaulSiteAreaPolygons[i]);
            massHaulSiteAreaPolygons[i].setMap(null);
        }
        massHaulSiteAreaPolygons = [];
    };

    namespace.toggleSitePolygonsOpacity = function (fill) {
        for (var key in sitePolygons) {
            var site = sitePolygons[key];
            if (site.siteType != vss.common.EnumSiteType.PROJECT_SITE && !site.transparent) {
                var opacity = fill ? constants.SITE_FILL_OPACITY : 0;
                site.setOptions({fillOpacity: opacity});
            }
        }
    };

    namespace.textForTooltipAtPoint = function(point, deepLayer) {
        var polygon = null;
        if (deepLayer) {
            polygon = VLMapUtil.findPolygonWithEdgeAtPoint(point, projectPolygons);
        } else {
            polygon = VLMapUtil.findPolygonWithEdgeAtPoint(point, massHaulSiteAreaPolygons);
            if (polygon == null) {
                polygon = VLMapUtil.findPolygonWithEdgeAtPoint(point, sitePolygonArray);
            }
        }
        if (polygon == null) {
            return null;
        } else {
            return polygon.siteName + (polygon.siteType == vss.common.EnumSiteType.PROJECT_SITE ? "*" : "");
        }
    }


} (window.VLSitePolygon = window.VLSitePolygon || {}, jQuery));
