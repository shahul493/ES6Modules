'use strict';
window.vlmap = window.vlmap || {};
vlmap.controllers = vlmap.controllers || {};
(function (ALKMapMarker, undefined) {
    ALKMapMarker.markercontroller = function (map,markerLabelOptions, layers) {
        this.map=map;
        this.markers = [];
        this.customMarkers = [];
        this.markerLabelOptions = markerLabelOptions;
        this.layers = layers;
    };

    ALKMapMarker.markercontroller.prototype = function () {
        var createDefaultMarker = function (assetData,iconPath) {
            var mkrFav =  null;            

                mkrFav = new ALKMaps.Marker(
	            new ALKMaps.LonLat(assetData.longitude, assetData.latitude).transform(new ALKMaps.Projection("EPSG:4326"), this.map.getProjectionObject()),
	                new ALKMaps.Icon(iconPath, new ALKMaps.Size(13, 24)).clone(),
	                "Store #985",
	                {
	                    map: this.map,
	                    asset: assetData,
	                    eventListeners: {
	                        // Show popup when click on the marker icon
	                        "markerclick": function (evt) {
                                //disptach defaultMarker click event

	                        },
	                        "mousemove": function (e) {
                                //dispatch default marker mousemove event
	                        }

	                    }
	                    
	                }

                );

                this.layers[2].addMarker(mkrFav);
            
            this.markers.push(mkrFav);
        },

        // create default markers "markerController.createDefaultMarkers(validAssets);"

      createDefaultMarkers = function (assetsData, iconPath) {
            var mkrFav =  null;
            
                for(var i=0;i<assetsData.length;i++)
                {
                mkrFav = null;
                    mkrFav = new ALKMaps.Marker(
	                new ALKMaps.LonLat(assetsData[i].longitude, assetsData[i].latitude).transform(new ALKMaps.Projection("EPSG:4326"), this.map.getProjectionObject()),
	                    new ALKMaps.Icon(iconPath, new ALKMaps.Size(13, 24)).clone(),
	                    "Store #985",
	                    {
	                        map: this.map,
	                        asset: assetsData[i],
	                        eventListeners: {
	                            // Show popup when click on the marker icon
	                            "markerclick": function (evt) {
                                    //disptach defaultMarker click event

	                            },
	                            "mousemove": function (e) {
                                    //dispatch default marker mousemove event
	                            }

	                        }
	                    
	                    }

                    );

                    this.layers[2].addMarker(mkrFav);
            
                    this.markers.push(mkrFav);
                }
        },
        createCustomMarker = function (assetData) {
       
            for(var i=0;i<assetData.length;i++)
            {
                 var htmlstring =  getCustomWindowHTML(assetData[i],this.markerLabelOptions);
		        var mkr = ALKMaps.Marker2.Anchored.topright(assetData.assetID,
                                                            new ALKMaps.LonLat(assetData[i].longitude, assetData[i].latitude).transform(new ALKMaps.Projection("EPSG:4326"), this.map.getProjectionObject()),
                                                            new ALKMaps.Size(68, 46),
                                                            htmlstring,
                                                            {
                                                                size: new ALKMaps.Size(0, 0),
                                                                offset: new ALKMaps.Pixel(-25, 25)
                                                            },
                                                            null,                                                           
                                                            null);
                
                mkr.backgroundColor = "";
                mkr.autoSize = true; 
                this.customMarkers.push(mkr);
                mkr.data = assetData[i];

                mkr.events.register("click", mkr, function (e) {                    
                    $(customMarkerEvents).trigger(customMarkerEvent.CUSTOM_MARKER_CLICK_EVENT.type,this.data);
                });
            
             } 
             this.layers[2].addMarkers(this.customMarkers)  ;

        },
        removeMarkers = function () {
          for(var i=0;i<this.markers.length;i++)
          {
                this.layers[2].removeMarker(this.markers[i]);
          }
          this.markers = [];
          for(var i=0;i<this.customMarkers.length;i++)
          {
                this.layers[2].removeMarker(this.customMarkers[i]);
          }
          this.customMarkers = [];
        },
        
       getCustomWindowHTML = function (assetData,markeroptions) {
            //this.assetsData = assetData;
            var labelToDisplay;
            var imageToDisplay = '../src/images/AssetIcons/3512.png';
            if(markeroptions.vin)
                labelToDisplay = assetData.equipmentVIN;
            if(markeroptions.fuel)
                labelToDisplay = assetData.fuelPercentRemaining;
            if(markeroptions.loc)
                labelToDisplay = assetData.location;

            var htmlString = "<div class='callout'><div class='imgDiv'><img src='" + imageToDisplay + "' /></div> <div class='calloutLabelHolder'><p class='calloutLabel'>" + labelToDisplay + "</p></div> <div class='expandDiv'><img src='../src/images/calloutExpandIcon.png' /></div></div>"
            return htmlString;
        }

        return {
            createDefaultMarker: createDefaultMarker,
            createCustomMarker: createCustomMarker,
            removeMarkers:removeMarkers,
            createDefaultMarkers:createDefaultMarkers

        };
    } ();
})(vlmap.controllers);