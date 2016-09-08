'use strict';

window.vlmap = window.vlmap || {};
vlmap.controllers = vlmap.controllers || {};
(function (vlInfoWindow, undefined) {
    vlInfoWindow.InfoWindow = function (map) {
        this.fc = null;
        this.map = map;
    };

    vlInfoWindow.InfoWindow.prototype = function () {

        var createInfoWindow = function (ID,lon,lat,width,height,htmlString) {
            this.fc =  new ALKMaps.Popup.FramedCloud(ID,
                   new ALKMaps.LonLat(lon, lat).transform(new ALKMaps.Projection("EPSG:4326"), this.map.getProjectionObject()), //transform to mercator
                    new ALKMaps.Size(width, height),
                    htmlString,
                    null,
                    true        // Show close icon
                );
            this.fc.autoSize = true;
            this.fc.calculateRelativePosition = function () { return "tr"; };
           
            return this.fc;
        },
        resetContent = function (htmlString) {
            this.fc.setContentHTML(htmlString);
        }
       
        return {
            createInfoWindow: createInfoWindow,
            resetContent:resetContent
        };
    } ();
})(vlmap.controllers);