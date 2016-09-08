'use strict';

window.vlmap = window.vlmap || {};
vlmap.controls = vlmap.controls || {};
(function (vlMarkerData, undefined) {
    vlMarkerData.VLMarkersData = function (assetData) {
        this.assetData = assetData;
    }

    vlMarkerData.VLMarkersData.prototype = function () {

        var returnValidData = function () {            
            var validData = [];           
            for (var i = 0; i < this.assetData.length; i++) {
                    if (this.assetData[i].latitude != null && this.assetData[i].longitude != null) {
                        validData.push(this.assetData[i]);
                    }
                }
                return validData;           
        }
        return {
            getValidData: returnValidData

        };
    }();
})(vlmap.controls);