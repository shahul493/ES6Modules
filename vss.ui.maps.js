/// <reference path="../typings/tsd.d.ts" />
"use strict";
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            angular.module("vss.ui.maps", []);
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="vss.ui.maps.module.ts" />
"use strict";
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            var Constants = (function () {
                function Constants() {
                }
                Object.defineProperty(Constants, "Layers", {
                    get: function () {
                        return [
                            {
                                name: "Map",
                                active: true,
                                source: {
                                    type: "OSM",
                                    url: "https://pcmiler.alk.com/APIs/REST/v1.0/service.svc/maptile?" + "AUTHTOKEN=366658D213F9F1429033919FCAE365FC&projection=EPSG:900913&" + "region=EU&style=default&z={z}&x={x}&y={y}",
                                    attribution: "<a href = 'http://alkmaps.com' target = '_blank'  id = 'alkLogo'>" + "<img src = 'assets/images/alkmaps-logo-sm.png'>" + "Copyright © 2015 ALK Technologies Inc.</a>",
                                    wrapX: false
                                },
                                renderer: "canvas"
                            },
                            {
                                name: "Terrain",
                                active: false,
                                source: {
                                    type: "OSM",
                                    url: "https://pcmiler.alk.com/APIs/REST/v1.0/service.svc/maptile?" + "AUTHTOKEN=366658D213F9F1429033919FCAE365FC&projection=EPSG:900913&region=EU&" + "style=terrain&z={z}&x={x}&y={y}",
                                    attribution: "<a href = 'http://alkmaps.com' target = '_blank' id = 'alkLogo'>" + "<img src = 'assets/images/alkmaps-logo-sm.png'>" + "Copyright © 2015 ALK Technologies Inc.</a>",
                                    wrapX: false
                                },
                                renderer: "canvas"
                            },
                            {
                                name: "Satellite",
                                active: false,
                                source: {
                                    type: "OSM",
                                    url: "https://pcmiler.alk.com/APIs/REST/v1.0/service.svc/maptile?" + "AUTHTOKEN=366658D213F9F1429033919FCAE365FC&projection=EPSG:900913&" + "region=EU&style=satellite&IMGOPTION=Background&z={z}&x={x}&y={y}",
                                    attribution: "<a href = 'http://alkmaps.com' target = '_blank' id = 'alkLogo'>" + "<img src = 'assets/images/alkmaps-logo-sm.png'>" + "Copyright © 2015 ALK Technologies Inc.</a>",
                                    wrapX: false
                                },
                                renderer: "canvas"
                            },
                            {
                                name: "Hybrid",
                                active: false,
                                source: {
                                    type: "OSM",
                                    url: "https://pcmiler.alk.com/APIs/REST/v1.0/service.svc/maptile?" + "AUTHTOKEN=366658D213F9F1429033919FCAE365FC&projection=EPSG:900913&" + "region=EU&style=satellite&z={z}&x={x}&y={y}",
                                    attribution: "<a href = 'http://alkmaps.com' target = '_blank' id = 'alkLogo'>" + "<img src = 'assets/images/alkmaps-logo-sm.png'>" + "Copyright © 2015 ALK Technologies Inc.</a>",
                                    wrapX: false
                                },
                                renderer: "canvas"
                            }
                        ];
                    },
                    enumerable: true,
                    configurable: true
                });
                return Constants;
            })();
            maps.Constants = Constants;
            angular.module("vss.ui.maps").constant("layersConstant", Constants.Layers);
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));
;

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="openlayer3.alk.constant.ts" />
"use strict";
/**
 * @ngdoc function
 * @name openlayer3AlkController
 * @description
 * # openlayer3AlkController
 * Controller of the vss.common
 */
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            var AlkLayers = (function () {
                function AlkLayers() {
                }
                return AlkLayers;
            })();
            maps.AlkLayers = AlkLayers;
            var Openlayer3AlkController = (function () {
                function Openlayer3AlkController(layersConstant) {
                    this.layersConstant = layersConstant;
                    this.layers = layersConstant;
                    this.changeLayer = function (layer) {
                        this.layers.map(function (l) {
                            l.active = (l === layer);
                        });
                    };
                    this.selectedLayerName = this.layers[0];
                }
                Openlayer3AlkController.prototype.addMarkerInfoToAssets = function (asset) {
                    $(".popup-label").removeClass("popup-label").addClass("info-window");
                    asset.markerInfo = {};
                    asset.markerInfo.name = asset.assetName;
                    asset.markerInfo.lat = asset.lastReportedLocationLatitude;
                    asset.markerInfo.lon = asset.lastReportedLocationLongitude;
                    asset.markerInfo.loadColorBand = function () {
                        if (asset.fuelLevelLastReported > 74) {
                            console.log("gretarthan>74: " + asset.fuelLevelLastReported);
                            $(".info-window").css("background-color", "green");
                        }
                        else if (asset.fuelLevelLastReported > 49) {
                            console.log("gretarthan>49: " + asset.fuelLevelLastReported);
                            $(".info-window").css("background-color", "orange");
                        }
                        else if (asset.fuelLevelLastReported > 24) {
                            console.log("gretarthan>24: " + asset.fuelLevelLastReported);
                            $(".info-window").css("background-color", "red");
                        }
                        else {
                            console.log("lessthan<24: " + asset.fuelLevelLastReported);
                            $(".info-window").css("background-color", "darkred");
                        }
                    };
                    asset.markerInfo.label = {
                        message: "<div class = \"info-window-inner-container\">" + "<div class = \"info-window-inner-img\">" + "<img src=\"" + asset.assetIconUrl + "\">" + "</div>" + "<div class = \"info-window-inner-text\">" + "<p><strong>" + asset.assetName + "</strong>" + " " + asset.assetSerialNumber + "<br />" + asset.makeCode + " " + asset.model + "</p>" + "<p><a href='#/asset?assetId=" + asset.assetIdentifier + "'>Details</a> | " + "<a href='#/fleet?panel=map'>Location</a></p>" + "</div>" + "<div class = 'fuel-status-container' ng-init = " + asset.markerInfo.loadColorBand() + "></div>" + "</div>",
                        show: false,
                        showOnMouseClick: true
                    };
                    return asset;
                };
                return Openlayer3AlkController;
            })();
            maps.Openlayer3AlkController = Openlayer3AlkController;
            angular.module("vss.ui.maps").controller("openlayer3AlkController", Openlayer3AlkController);
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="vss.ui.maps.module.ts" />
"use strict";
/**
 * @ngdoc directive
 * @name vss.directive:animateonchange
 * @description
 * adds the "changed" class when a value changes and removes it after 1 second
 * Inspired by http://stackoverflow.com/a/20056060/444917
 */
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            "use strict";
            function Ol3AlkMap() {
                return {
                    restrict: "EA",
                    bindToController: {
                        mapAssets: "=?",
                        center: "=?",
                        view: "=?"
                    },
                    scope: true,
                    controller: "openlayer3AlkController",
                    controllerAs: "vms",
                    template: "<div class='alk-map-wrapper'>" + "<select class = 'pull-right ol-map-type-options' ng-options = 'layer.name for  layer in vms.layers'" + "ng-model = 'vms.selectedLayerName' ng-change = 'vms.changeLayer(vms.selectedLayerName);'>" + "</select>" + "<openlayers ol-center = 'vm.center' ol-view='vm.view' custom-layers = 'true'>" + "<ol-layer name = '{{ layer.name }}' ol-layer-properties = 'layer' " + "ng-repeat = 'layer in vms.layers | filter : { active : true}'></ol-layer>" + "<ol-marker class = 'vl-map-marker' data-ng-repeat = 'marker in vm.mapAssets' ng-init='vms.addMarkerInfoToAssets(marker);'" + "ol-marker-properties = 'marker.markerInfo'>" + "</ol-marker>" + "<ol-layer ol-layer-properties='layer' ng-repeat='layer in vm.geofence | filter:{active:true}'></ol-layer>" + "</openlayers> </div>"
                };
            }
            maps.Ol3AlkMap = Ol3AlkMap;
            angular.module("vss.ui.maps").directive("ol3AlkMap", Ol3AlkMap);
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

/// <reference path="../../typings/angularjs/angular.d.ts" />
"use strict";
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            var demo;
            (function (demo) {
                var Asset = (function () {
                    function Asset() {
                    }
                    return Asset;
                })();
                demo.Asset = Asset;
            })(demo = maps.demo || (maps.demo = {}));
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../vss.ui.maps.module.ts" />
"use strict";
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            var demo;
            (function (demo) {
                angular.module("vss.ui.maps.demo", [
                    "vss.ui.maps",
                    "vss.ui.utilities",
                    "ngRoute",
                    "openlayers-directive"
                ]).config(function ($routeProvider) {
                    $routeProvider.when("/", {
                        templateUrl: "demo/maps.demo.html",
                        controller: "DemoController as vm"
                    });
                });
            })(demo = maps.demo || (maps.demo = {}));
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

"use strict";
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            var demo;
            (function (demo) {
                var SampleService = (function () {
                    function SampleService($http) {
                        var _this = this;
                        this.$http = $http;
                        $http.get("assets/data/assetIcon.json").then(function (response) {
                            if (response.status === 200) {
                                _this.iconIdToImageMap = response.data;
                                return _this.iconIdToImageMap;
                            }
                            else {
                                console.log(response.statusText);
                            }
                        });
                    }
                    SampleService.prototype.getMapAssets = function () {
                        var _this = this;
                        return this.$http.get("assets/data/assets.json").then(function (response) {
                            if (response.status === 200) {
                                var assetData = response.data;
                                assetData.forEach(function (asset) {
                                    if (asset.assetIcon) {
                                        asset.assetIconUrl = _this.iconIdToImageMap.iconIdToImageMap[asset.assetIcon];
                                    }
                                });
                                return assetData;
                            }
                            else {
                                console.log(response.statusText);
                            }
                        });
                    };
                    SampleService.prototype.getGeofenceData = function () {
                        return this.$http.get("assets/data/geofence.json").then(function (response) {
                            if (response.status === 200) {
                                return response.data;
                            }
                            else {
                                console.log(response.data);
                            }
                        });
                    };
                    return SampleService;
                })();
                demo.SampleService = SampleService;
                angular.module("vss.ui.maps.demo").service("MapService", SampleService);
            })(demo = maps.demo || (maps.demo = {}));
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

/// <reference path="maps.demo.module.ts" />
/// <reference path="maps.demo.service.ts" />
/// <reference path="asset.model.ts" />
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var vss;
(function (vss) {
    var ui;
    (function (ui) {
        var maps;
        (function (maps) {
            var demo;
            (function (demo) {
                var DemoController = (function () {
                    function DemoController($scope, MapService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.MapService = MapService;
                        this.geofence = [];
                        this.center = {
                            lat: 39.9012751,
                            lon: -105.1102863,
                            zoom: 4
                        };
                        this.view = {
                            minZoom: 1.2,
                            maxZoom: 16
                        };
                        this.mapAssetsExtents = [0, 0, 0, 0];
                        this.refreshData();
                        MapService.getGeofenceData().then(function (data) {
                            _this.geofence = [{
                                active: false,
                                source: {
                                    type: "GeoJSON",
                                    geojson: {
                                        object: data,
                                        projection: "EPSG:3857"
                                    }
                                },
                                style: {
                                    fill: {
                                        color: "rgba(255, 0, 0, 0.6)"
                                    },
                                    stroke: {
                                        color: "white",
                                        width: 3
                                    }
                                }
                            }];
                        });
                    }
                    DemoController.prototype.refreshData = function () {
                        var _this = this;
                        this.MapService.getMapAssets().then(function (assets) {
                            _this.mapAssets = assets;
                            //this.updateMapExtents(this.mapAssets);
                        });
                    };
                    DemoController.prototype.updateMapExtents = function (mapAssets) {
                        var _this = this;
                        this.mapAssetsExtents[0] = mapAssets[0].lastReportedLocationLatitude;
                        this.mapAssetsExtents[2] = mapAssets[0].lastReportedLocationLatitude;
                        this.mapAssetsExtents[1] = mapAssets[0].lastReportedLocationLongitude;
                        this.mapAssetsExtents[3] = mapAssets[0].lastReportedLocationLongitude;
                        _.forEach(mapAssets, function (asset) {
                            if (asset.lastReportedLocationLatitude < _this.mapAssetsExtents[0]) {
                                _this.mapAssetsExtents[0] = asset.lastReportedLocationLatitude;
                            }
                            if (asset.lastReportedLocationLongitude < _this.mapAssetsExtents[1]) {
                                _this.mapAssetsExtents[1] = asset.lastReportedLocationLongitude;
                            }
                            if (asset.lastReportedLocationLatitude > _this.mapAssetsExtents[2]) {
                                _this.mapAssetsExtents[2] = asset.lastReportedLocationLatitude;
                            }
                            if (asset.lastReportedLocationLongitude > _this.mapAssetsExtents[3]) {
                                _this.mapAssetsExtents[3] = asset.lastReportedLocationLongitude;
                            }
                        });
                        this.center["lat"] = (this.mapAssetsExtents[2] + this.mapAssetsExtents[0]) / 2;
                        this.center["lon"] = (this.mapAssetsExtents[3] + this.mapAssetsExtents[1]) / 2;
                        return this.center;
                    };
                    return DemoController;
                })();
                demo.DemoController = DemoController;
                angular.module("vss.ui.maps.demo").controller("DemoController", DemoController);
            })(demo = maps.demo || (maps.demo = {}));
        })(maps = ui.maps || (ui.maps = {}));
    })(ui = vss.ui || (vss.ui = {}));
})(vss || (vss = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZzcy51aS5tYXBzLm1vZHVsZS50cyIsIm9wZW5sYXllcjMuYWxrLmNvbnN0YW50LnRzIiwib3BlbmxheWVyMy5hbGsuY29udHJvbGxlci50cyIsIm9wZW5sYXllcjMuYWxrLmRpcmVjdGl2ZS50cyIsImRlbW8vYXNzZXQubW9kZWwudHMiLCJkZW1vL21hcHMuZGVtby5tb2R1bGUudHMiLCJkZW1vL21hcHMuZGVtby5zZXJ2aWNlLnRzIiwiZGVtby9tYXBzLmRlbW8uY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJ2c3MiLCJ2c3MudWkiLCJ2c3MudWkubWFwcyIsInZzcy51aS5tYXBzLkNvbnN0YW50cyIsInZzcy51aS5tYXBzLkNvbnN0YW50cy5jb25zdHJ1Y3RvciIsInZzcy51aS5tYXBzLkNvbnN0YW50cy5MYXllcnMiLCJ2c3MudWkubWFwcy5BbGtMYXllcnMiLCJ2c3MudWkubWFwcy5BbGtMYXllcnMuY29uc3RydWN0b3IiLCJ2c3MudWkubWFwcy5PcGVubGF5ZXIzQWxrQ29udHJvbGxlciIsInZzcy51aS5tYXBzLk9wZW5sYXllcjNBbGtDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwidnNzLnVpLm1hcHMuT3BlbmxheWVyM0Fsa0NvbnRyb2xsZXIuYWRkTWFya2VySW5mb1RvQXNzZXRzIiwidnNzLnVpLm1hcHMuT2wzQWxrTWFwIiwidnNzLnVpLm1hcHMuZGVtbyIsInZzcy51aS5tYXBzLmRlbW8uQXNzZXQiLCJ2c3MudWkubWFwcy5kZW1vLkFzc2V0LmNvbnN0cnVjdG9yIiwidnNzLnVpLm1hcHMuZGVtby5TYW1wbGVTZXJ2aWNlIiwidnNzLnVpLm1hcHMuZGVtby5TYW1wbGVTZXJ2aWNlLmNvbnN0cnVjdG9yIiwidnNzLnVpLm1hcHMuZGVtby5TYW1wbGVTZXJ2aWNlLmdldE1hcEFzc2V0cyIsInZzcy51aS5tYXBzLmRlbW8uU2FtcGxlU2VydmljZS5nZXRHZW9mZW5jZURhdGEiLCJ2c3MudWkubWFwcy5kZW1vLkRlbW9Db250cm9sbGVyIiwidnNzLnVpLm1hcHMuZGVtby5EZW1vQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsInZzcy51aS5tYXBzLmRlbW8uRGVtb0NvbnRyb2xsZXIucmVmcmVzaERhdGEiLCJ2c3MudWkubWFwcy5kZW1vLkRlbW9Db250cm9sbGVyLnVwZGF0ZU1hcEV4dGVudHMiXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUU1QyxZQUFZLENBQUM7QUFFYixJQUFPLEdBQUcsQ0FFVDtBQUZELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxFQUFFQSxDQUVaQTtJQUZVQSxXQUFBQSxFQUFFQTtRQUFDQyxJQUFBQSxJQUFJQSxDQUVqQkE7UUFGYUEsV0FBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7WUFDbEJDLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1FBQ3BDQSxDQUFDQSxFQUZhRCxJQUFJQSxHQUFKQSxPQUFJQSxLQUFKQSxPQUFJQSxRQUVqQkE7SUFBREEsQ0FBQ0EsRUFGVUQsRUFBRUEsR0FBRkEsTUFBRUEsS0FBRkEsTUFBRUEsUUFFWkE7QUFBREEsQ0FBQ0EsRUFGTSxHQUFHLEtBQUgsR0FBRyxRQUVUOztBQ05ELDBEQUEwRDtBQUMxRCw4Q0FBOEM7QUFFOUMsWUFBWSxDQUFDO0FBRWIsSUFBTyxHQUFHLENBdUVUO0FBdkVELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxFQUFFQSxDQXVFWkE7SUF2RVVBLFdBQUFBLEVBQUVBO1FBQUNDLElBQUFBLElBQUlBLENBdUVqQkE7UUF2RWFBLFdBQUFBLElBQUlBLEVBQUNBLENBQUNBO1lBRXBCQyxJQUFhQSxTQUFTQTtnQkFBdEJDLFNBQWFBLFNBQVNBO2dCQWtFdEJDLENBQUNBO2dCQWpFR0Qsc0JBQVdBLG1CQUFNQTt5QkFBakJBO3dCQUNJRSxNQUFNQSxDQUFDQTs0QkFDUEE7Z0NBQ0lBLElBQUlBLEVBQUVBLEtBQUtBO2dDQUNYQSxNQUFNQSxFQUFFQSxJQUFJQTtnQ0FDWkEsTUFBTUEsRUFBRUE7b0NBQ0pBLElBQUlBLEVBQUVBLEtB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QUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9FQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtvQkFDdkJBLENBQUNBO29CQUVMSCxxQkFBQ0E7Z0JBQURBLENBekVBUCxBQXlFQ08sSUFBQVA7Z0JBekVZQSxtQkFBY0EsR0FBZEEsY0F5RVpBLENBQUFBO2dCQUNEQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxrQkFBa0JBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFnQkEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7WUFDcEZBLENBQUNBLEVBN0VrQlYsSUFBSUEsR0FBSkEsU0FBSUEsS0FBSkEsU0FBSUEsUUE2RXRCQTtRQUFEQSxDQUFDQSxFQTdFYUQsSUFBSUEsR0FBSkEsT0FBSUEsS0FBSkEsT0FBSUEsUUE2RWpCQTtJQUFEQSxDQUFDQSxFQTdFVUQsRUFBRUEsR0FBRkEsTUFBRUEsS0FBRkEsTUFBRUEsUUE2RVpBO0FBQURBLENBQUNBLEVBN0VNLEdBQUcsS0FBSCxHQUFHLFFBNkVUIiwiZmlsZSI6InZzcy51aS5tYXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUgdnNzLnVpLm1hcHMge1xyXG4gIGFuZ3VsYXIubW9kdWxlKFwidnNzLnVpLm1hcHNcIiwgW10pO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2FuZ3VsYXJqcy9hbmd1bGFyLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidnNzLnVpLm1hcHMubW9kdWxlLnRzXCIgLz5cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlIHZzcy51aS5tYXBzIHtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25zdGFudHMge1xyXG4gICAgc3RhdGljIGdldCBMYXllcnMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJNYXBcIixcclxuICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiT1NNXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9wY21pbGVyLmFsay5jb20vQVBJcy9SRVNUL3YxLjAvc2VydmljZS5zdmMvbWFwdGlsZT9cIiArXHJcbiAgICAgICAgICAgICAgICBcIkFVVEhUT0tFTj0zNjY2NThEMjEzRjlGMTQyOTAzMzkxOUZDQUUzNjVGQyZwcm9qZWN0aW9uPUVQU0c6OTAwOTEzJlwiICtcclxuICAgICAgICAgICAgICAgIFwicmVnaW9uPUVVJnN0eWxlPWRlZmF1bHQmej17en0meD17eH0meT17eX1cIixcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBcIjxhIGhyZWYgPSAnaHR0cDovL2Fsa21hcHMuY29tJyB0YXJnZXQgPSAnX2JsYW5rJyAgaWQgPSAnYWxrTG9nbyc+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCI8aW1nIHNyYyA9ICdhc3NldHMvaW1hZ2VzL2Fsa21hcHMtbG9nby1zbS5wbmcnPlwiICtcclxuICAgICAgICAgICAgICAgIFwiQ29weXJpZ2h0IMKpIDIwMTUgQUxLIFRlY2hub2xvZ2llcyBJbmMuPC9hPlwiLFxyXG4gICAgICAgICAgICAgICAgd3JhcFg6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbmRlcmVyOiBcImNhbnZhc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiVGVycmFpblwiLFxyXG4gICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiT1NNXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9wY21pbGVyLmFsay5jb20vQVBJcy9SRVNUL3YxLjAvc2VydmljZS5zdmMvbWFwdGlsZT9cIiArXHJcbiAgICAgICAgICAgICAgICBcIkFVVEhUT0tFTj0zNjY2NThEMjEzRjlGMTQyOTAzMzkxOUZDQUUzNjVGQyZwcm9qZWN0aW9uPUVQU0c6OTAwOTEzJnJlZ2lvbj1FVSZcIiArXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlPXRlcnJhaW4mej17en0meD17eH0meT17eX1cIixcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBcIjxhIGhyZWYgPSAnaHR0cDovL2Fsa21hcHMuY29tJyB0YXJnZXQgPSAnX2JsYW5rJyBpZCA9ICdhbGtMb2dvJz5cIiArXHJcbiAgICAgICAgICAgICAgICBcIjxpbWcgc3JjID0gJ2Fzc2V0cy9pbWFnZXMvYWxrbWFwcy1sb2dvLXNtLnBuZyc+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCJDb3B5cmlnaHQgwqkgMjAxNSBBTEsgVGVjaG5vbG9naWVzIEluYy48L2E+XCIsXHJcbiAgICAgICAgICAgICAgICB3cmFwWDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVuZGVyZXI6IFwiY2FudmFzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJTYXRlbGxpdGVcIixcclxuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk9TTVwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGNtaWxlci5hbGsuY29tL0FQSXMvUkVTVC92MS4wL3NlcnZpY2Uuc3ZjL21hcHRpbGU/XCIgK1xyXG4gICAgICAgICAgICAgICAgXCJBVVRIVE9LRU49MzY2NjU4RDIxM0Y5RjE0MjkwMzM5MTlGQ0FFMzY1RkMmcHJvamVjdGlvbj1FUFNHOjkwMDkxMyZcIiArXHJcbiAgICAgICAgICAgICAgICBcInJlZ2lvbj1FVSZzdHlsZT1zYXRlbGxpdGUmSU1HT1BUSU9OPUJhY2tncm91bmQmej17en0meD17eH0meT17eX1cIixcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBcIjxhIGhyZWYgPSAnaHR0cDovL2Fsa21hcHMuY29tJyB0YXJnZXQgPSAnX2JsYW5rJyBpZCA9ICdhbGtMb2dvJz5cIiArXHJcbiAgICAgICAgICAgICAgICBcIjxpbWcgc3JjID0gJ2Fzc2V0cy9pbWFnZXMvYWxrbWFwcy1sb2dvLXNtLnBuZyc+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCJDb3B5cmlnaHQgwqkgMjAxNSBBTEsgVGVjaG5vbG9naWVzIEluYy48L2E+XCIsXHJcbiAgICAgICAgICAgICAgICB3cmFwWDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVuZGVyZXI6IFwiY2FudmFzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJIeWJyaWRcIixcclxuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk9TTVwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGNtaWxlci5hbGsuY29tL0FQSXMvUkVTVC92MS4wL3NlcnZpY2Uuc3ZjL21hcHRpbGU/XCIgK1xyXG4gICAgICAgICAgICAgICAgXCJBVVRIVE9LRU49MzY2NjU4RDIxM0Y5RjE0MjkwMzM5MTlGQ0FFMzY1RkMmcHJvamVjdGlvbj1FUFNHOjkwMDkxMyZcIiArXHJcbiAgICAgICAgICAgICAgICBcInJlZ2lvbj1FVSZzdHlsZT1zYXRlbGxpdGUmej17en0meD17eH0meT17eX1cIixcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiBcIjxhIGhyZWYgPSAnaHR0cDovL2Fsa21hcHMuY29tJyB0YXJnZXQgPSAnX2JsYW5rJyBpZCA9ICdhbGtMb2dvJz5cIiArXHJcbiAgICAgICAgICAgICAgICBcIjxpbWcgc3JjID0gJ2Fzc2V0cy9pbWFnZXMvYWxrbWFwcy1sb2dvLXNtLnBuZyc+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCJDb3B5cmlnaHQgwqkgMjAxNSBBTEsgVGVjaG5vbG9naWVzIEluYy48L2E+XCIsXHJcbiAgICAgICAgICAgICAgICB3cmFwWDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVuZGVyZXI6IFwiY2FudmFzXCJcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIH1cclxufVxyXG4gICAgICBcclxuIGFuZ3VsYXIubW9kdWxlKFwidnNzLnVpLm1hcHNcIikuY29uc3RhbnQoXCJsYXllcnNDb25zdGFudFwiLCBDb25zdGFudHMuTGF5ZXJzKTtcclxufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvcGVubGF5ZXIzLmFsay5jb25zdGFudC50c1wiIC8+XHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBAbmdkb2MgZnVuY3Rpb25cclxuICogQG5hbWUgb3BlbmxheWVyM0Fsa0NvbnRyb2xsZXJcclxuICogQGRlc2NyaXB0aW9uXHJcbiAqICMgb3BlbmxheWVyM0Fsa0NvbnRyb2xsZXJcclxuICogQ29udHJvbGxlciBvZiB0aGUgdnNzLmNvbW1vblxyXG4gKi9cclxubW9kdWxlIHZzcy51aS5tYXBzIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQWxrTGF5ZXJzIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgYWN0aXZlOiBib29sZWFuO1xyXG4gICAgICAgIHNvdXJjZToge1xyXG4gICAgICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIHVybDogc3RyaW5nO1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogc3RyaW5nO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE9wZW5sYXllcjNBbGtDb250cm9sbGVyIHtcclxuICAgICAgICBwdWJsaWMgbGF5ZXJzOiBBbGtMYXllcnNbXTtcclxuICAgICAgICBwdWJsaWMgY2hhbmdlTGF5ZXI7XHJcbiAgICAgICAgcHVibGljIHNlbGVjdGVkTGF5ZXJOYW1lOiB7fTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBsYXllcnNDb25zdGFudCkge1xyXG4gICAgICAgICAgICB0aGlzLmxheWVycyA9IGxheWVyc0NvbnN0YW50O1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUxheWVyID0gZnVuY3Rpb24obGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGF5ZXJzLm1hcChmdW5jdGlvbihsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbC5hY3RpdmUgPSAobCA9PT0gbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRMYXllck5hbWUgPSB0aGlzLmxheWVyc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE1hcmtlckluZm9Ub0Fzc2V0cyhhc3NldCkge1xyXG4gICAgICAgICAgICAkKFwiLnBvcHVwLWxhYmVsXCIpLnJlbW92ZUNsYXNzKFwicG9wdXAtbGFiZWxcIikuYWRkQ2xhc3MoXCJpbmZvLXdpbmRvd1wiKTtcclxuICAgICAgICAgICAgYXNzZXQubWFya2VySW5mbyA9IHt9O1xyXG4gICAgICAgICAgICBhc3NldC5tYXJrZXJJbmZvLm5hbWUgPSBhc3NldC5hc3NldE5hbWU7XHJcbiAgICAgICAgICAgIGFzc2V0Lm1hcmtlckluZm8ubGF0ID0gYXNzZXQubGFzdFJlcG9ydGVkTG9jYXRpb25MYXRpdHVkZTtcclxuICAgICAgICAgICAgYXNzZXQubWFya2VySW5mby5sb24gPSBhc3NldC5sYXN0UmVwb3J0ZWRMb2NhdGlvbkxvbmdpdHVkZTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgYXNzZXQubWFya2VySW5mby5sb2FkQ29sb3JCYW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXQuZnVlbExldmVsTGFzdFJlcG9ydGVkID4gNzQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdyZXRhcnRoYW4+NzQ6IFwiICsgYXNzZXQuZnVlbExldmVsTGFzdFJlcG9ydGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmluZm8td2luZG93XCIpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJncmVlblwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXNzZXQuZnVlbExldmVsTGFzdFJlcG9ydGVkID4gNDkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdyZXRhcnRoYW4+NDk6IFwiICsgYXNzZXQuZnVlbExldmVsTGFzdFJlcG9ydGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmluZm8td2luZG93XCIpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJvcmFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFzc2V0LmZ1ZWxMZXZlbExhc3RSZXBvcnRlZCA+IDI0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJncmV0YXJ0aGFuPjI0OiBcIiArIGFzc2V0LmZ1ZWxMZXZlbExhc3RSZXBvcnRlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5pbmZvLXdpbmRvd1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwicmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxlc3N0aGFuPDI0OiBcIiArIGFzc2V0LmZ1ZWxMZXZlbExhc3RSZXBvcnRlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5pbmZvLXdpbmRvd1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwiZGFya3JlZFwiKTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYXNzZXQubWFya2VySW5mby5sYWJlbCA9IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6XHJcbiAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzID0gXFxcImluZm8td2luZG93LWlubmVyLWNvbnRhaW5lclxcXCI+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3MgPSBcXFwiaW5mby13aW5kb3ctaW5uZXItaW1nXFxcIj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxpbWcgc3JjPVxcXCJcIiArIGFzc2V0LmFzc2V0SWNvblVybCArIFwiXFxcIj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3MgPSBcXFwiaW5mby13aW5kb3ctaW5uZXItdGV4dFxcXCI+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8cD48c3Ryb25nPlwiICsgYXNzZXQuYXNzZXROYW1lICsgXCI8L3N0cm9uZz5cIiArIFwiIFwiICsgYXNzZXQuYXNzZXRTZXJpYWxOdW1iZXIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPGJyIC8+XCIgKyBhc3NldC5tYWtlQ29kZSArIFwiIFwiICsgYXNzZXQubW9kZWwgKyBcIjwvcD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxwPjxhIGhyZWY9JyMvYXNzZXQ/YXNzZXRJZD1cIiArIGFzc2V0LmFzc2V0SWRlbnRpZmllciArIFwiJz5EZXRhaWxzPC9hPiB8IFwiICsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIGhyZWY9JyMvZmxlZXQ/cGFuZWw9bWFwJz5Mb2NhdGlvbjwvYT48L3A+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvZGl2PlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzID0gJ2Z1ZWwtc3RhdHVzLWNvbnRhaW5lcicgbmctaW5pdCA9IFwiICsgYXNzZXQubWFya2VySW5mby5sb2FkQ29sb3JCYW5kKCkgKyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI+PC9kaXY+XCIgKyBcclxuICAgICAgICAgICAgICAgICAgICBcIjwvZGl2PlwiLFxyXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzaG93T25Nb3VzZUNsaWNrOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ2c3MudWkubWFwc1wiKS5jb250cm9sbGVyKFwib3BlbmxheWVyM0Fsa0NvbnRyb2xsZXJcIiwgT3BlbmxheWVyM0Fsa0NvbnRyb2xsZXIpO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidnNzLnVpLm1hcHMubW9kdWxlLnRzXCIgLz5cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcclxuICogQG5hbWUgdnNzLmRpcmVjdGl2ZTphbmltYXRlb25jaGFuZ2VcclxuICogQGRlc2NyaXB0aW9uXHJcbiAqIGFkZHMgdGhlIFwiY2hhbmdlZFwiIGNsYXNzIHdoZW4gYSB2YWx1ZSBjaGFuZ2VzIGFuZCByZW1vdmVzIGl0IGFmdGVyIDEgc2Vjb25kXHJcbiAqIEluc3BpcmVkIGJ5IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIwMDU2MDYwLzQ0NDkxN1xyXG4gKi9cclxuXHJcbm1vZHVsZSB2c3MudWkubWFwcyB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIFxyXG4gICAgaW50ZXJmYWNlIElWc1R5cGVhaGVhZERpcmVjdGl2ZVNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcclxuICAgICAgICB2bTogYW55O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gT2wzQWxrTWFwKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVBXCIsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIG1hcEFzc2V0czogXCI9P1wiLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyOiBcIj0/XCIsXHJcbiAgICAgICAgICAgICAgICB2aWV3OiBcIj0/XCIgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcIm9wZW5sYXllcjNBbGtDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJ2bXNcIixcclxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0nYWxrLW1hcC13cmFwcGVyJz5cIiArXHJcbiAgICAgICAgICAgIFwiPHNlbGVjdCBjbGFzcyA9ICdwdWxsLXJpZ2h0IG9sLW1hcC10eXBlLW9wdGlvbnMnIG5nLW9wdGlvbnMgPSAnbGF5ZXIubmFtZSBmb3IgIGxheWVyIGluIHZtcy5sYXllcnMnXCIgK1xyXG4gICAgICAgICAgICBcIm5nLW1vZGVsID0gJ3Ztcy5zZWxlY3RlZExheWVyTmFtZScgbmctY2hhbmdlID0gJ3Ztcy5jaGFuZ2VMYXllcih2bXMuc2VsZWN0ZWRMYXllck5hbWUpOyc+XCIgK1xyXG4gICAgICAgICAgICBcIjwvc2VsZWN0PlwiICtcclxuICAgICAgICAgICAgXCI8b3BlbmxheWVycyBvbC1jZW50ZXIgPSAndm0uY2VudGVyJyBvbC12aWV3PSd2bS52aWV3JyBjdXN0b20tbGF5ZXJzID0gJ3RydWUnPlwiICtcclxuICAgICAgICAgICAgXCI8b2wtbGF5ZXIgbmFtZSA9ICd7eyBsYXllci5uYW1lIH19JyBvbC1sYXllci1wcm9wZXJ0aWVzID0gJ2xheWVyJyBcIiArXHJcbiAgICAgICAgICAgIFwibmctcmVwZWF0ID0gJ2xheWVyIGluIHZtcy5sYXllcnMgfCBmaWx0ZXIgOiB7IGFjdGl2ZSA6IHRydWV9Jz48L29sLWxheWVyPlwiICtcclxuICAgICAgICAgICAgXCI8b2wtbWFya2VyIGNsYXNzID0gJ3ZsLW1hcC1tYXJrZXInIGRhdGEtbmctcmVwZWF0ID0gJ21hcmtlciBpbiB2bS5tYXBBc3NldHMnIG5nLWluaXQ9J3Ztcy5hZGRNYXJrZXJJbmZvVG9Bc3NldHMobWFya2VyKTsnXCIgK1xyXG4gICAgICAgICAgICBcIm9sLW1hcmtlci1wcm9wZXJ0aWVzID0gJ21hcmtlci5tYXJrZXJJbmZvJz5cIiArIFxyXG4gICAgICAgICAgICAgICAgLy8gXCI8ZGl2IGNsYXNzID0gJ2Z1ZWwtc3RhdHVzLWNvbnRhaW5lcidcIiArIFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwibmctaW5pdCA9ICd2bXMuYWRkQ29sb3JCYW5kKCknID5cIiArXHJcbiAgICAgICAgICAgICAgICAvLyBcIjwvZGl2PlwiICtcclxuICAgICAgICAgICAgXCI8L29sLW1hcmtlcj5cIiArXHJcbiAgICAgICAgICAgIFwiPG9sLWxheWVyIG9sLWxheWVyLXByb3BlcnRpZXM9J2xheWVyJyBuZy1yZXBlYXQ9J2xheWVyIGluIHZtLmdlb2ZlbmNlIHwgZmlsdGVyOnthY3RpdmU6dHJ1ZX0nPjwvb2wtbGF5ZXI+XCIgK1xyXG4gICAgICAgICAgICBcIjwvb3BlbmxheWVycz4gPC9kaXY+XCJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ2c3MudWkubWFwc1wiKS5kaXJlY3RpdmUoXCJvbDNBbGtNYXBcIiwgT2wzQWxrTWFwKTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9hbmd1bGFyanMvYW5ndWxhci5kLnRzXCIgLz5cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlIHZzcy51aS5tYXBzLmRlbW8ge1xyXG5cclxuICBleHBvcnQgY2xhc3MgQXNzZXQge1xyXG4gICAgYXNzZXRJZGVudGlmaWVyOiBzdHJpbmc7XHJcbiAgICBhc3NldE5hbWU6IHN0cmluZztcclxuICAgIGFzc2V0U2VyaWFsTnVtYmVyOiBzdHJpbmc7XHJcbiAgICBtYWtlQ29kZTogc3RyaW5nO1xyXG4gICAgYXNzZXRUeXBlOiBzdHJpbmc7XHJcbiAgICBtb2RlbDogc3RyaW5nO1xyXG4gICAgbGFzdFJlcG9ydGVkVGltZTogRGF0ZTtcclxuICAgIGdwc0RldmljZUlEOiBzdHJpbmc7XHJcbiAgICBkZXZpY2VUeXBlOiBzdHJpbmc7XHJcbiAgICBkZXZpY2VUeXBlSUQ6IG51bWJlcjtcclxuICAgIHN0YXR1czogc3RyaW5nO1xyXG4gICAgbGFzdFN0YXRlSUQ6IG51bWJlcjtcclxuICAgIGxhc3RTdGF0ZVVUQzogRGF0ZTtcclxuICAgIGhvdXJNZXRlcjogbnVtYmVyO1xyXG4gICAgb2RvbWV0ZXI6IG51bWJlcjtcclxuICAgIGZ1ZWxMZXZlbExhc3RSZXBvcnRlZDogbnVtYmVyO1xyXG4gICAgZnVlbFJlcG9ydGVkVGltZTogRGF0ZTtcclxuICAgIGxhc3RSZXBvcnRlZExvY2F0aW9uTGF0aXR1ZGU6IG51bWJlcjtcclxuICAgIGxhc3RSZXBvcnRlZExvY2F0aW9uTG9uZ2l0dWRlOiBudW1iZXI7XHJcbiAgICBsYXN0UmVwb3J0ZWRMb2NhdGlvbjogc3RyaW5nO1xyXG4gICAgaGlnaE5vdGlmaWNhdGlvbkNvdW50OiBudW1iZXI7XHJcbiAgICBtZWRpdW1Ob3RpZmljYXRpb25Db3VudDogbnVtYmVyO1xyXG4gICAgbG93Tm90aWZpY2F0aW9uQ291bnQ6IG51bWJlcjtcclxuICAgIG5vdGlmaWNhdGlvbnM6IG51bWJlcjtcclxuICAgIGFzc2V0SWNvbjogbnVtYmVyO1xyXG4gICAgbWFya2VySW5mbzogYW55O1xyXG4gICAgYXNzZXRJY29uVXJsOiBzdHJpbmc7XHJcbiAgICBub3RpZmljYXRpb25zQnlUeXBlOiB7IFtpbmRleDogc3RyaW5nXTogbnVtYmVyIH07XHJcbiAgICBpc1NlbGVjdGVkOiBib29sZWFuO1xyXG4gICAgYXNzZXRJY29uSUQ6IG51bWJlcjtcclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdnNzLnVpLm1hcHMubW9kdWxlLnRzXCIgLz5cclxuXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZSB2c3MudWkubWFwcy5kZW1vIHtcclxuICBhbmd1bGFyLm1vZHVsZShcInZzcy51aS5tYXBzLmRlbW9cIixcclxuICAgIFtcclxuICAgICAgXCJ2c3MudWkubWFwc1wiLFxyXG4gICAgICBcInZzcy51aS51dGlsaXRpZXNcIixcclxuICAgICAgXCJuZ1JvdXRlXCIsICAgICAgICBcclxuICAgICAgXCJvcGVubGF5ZXJzLWRpcmVjdGl2ZVwiXHJcbiAgICBdKVxyXG4gICAgLmNvbmZpZygoJHJvdXRlUHJvdmlkZXI6IG5nLnJvdXRlLklSb3V0ZVByb3ZpZGVyKSA9PiB7XHJcbiAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oXCIvXCIsIHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImRlbW8vbWFwcy5kZW1vLmh0bWxcIixcclxuICAgICAgICAgIGNvbnRyb2xsZXI6IFwiRGVtb0NvbnRyb2xsZXIgYXMgdm1cIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUgdnNzLnVpLm1hcHMuZGVtbyB7XHJcblxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIElBc3NldFNlcnZpY2Uge1xyXG4gICAgZ2V0TWFwQXNzZXRzKCk6IG5nLklQcm9taXNlPEFzc2V0W10+O1xyXG4gICAgZ2V0R2VvZmVuY2VEYXRhKCk6IG5nLklQcm9taXNlPGFueVtdPjtcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBTYW1wbGVTZXJ2aWNlIGltcGxlbWVudHMgSUFzc2V0U2VydmljZSB7XHJcbiAgICBwcml2YXRlIGljb25JZFRvSW1hZ2VNYXA6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge1xyXG4gICAgICAkaHR0cC5nZXQoXCJhc3NldHMvZGF0YS9hc3NldEljb24uanNvblwiKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgdGhpcy5pY29uSWRUb0ltYWdlTWFwID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmljb25JZFRvSW1hZ2VNYXA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TWFwQXNzZXRzKCk6IG5nLklQcm9taXNlPEFzc2V0W10+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0PEFzc2V0W10+KFwiYXNzZXRzL2RhdGEvYXNzZXRzLmpzb25cIilcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICB2YXIgYXNzZXREYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgYXNzZXREYXRhLmZvckVhY2goKGFzc2V0OiBBc3NldCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChhc3NldC5hc3NldEljb24pIHtcclxuICAgICAgICAgICAgICAgIGFzc2V0LmFzc2V0SWNvblVybCA9IHRoaXMuaWNvbklkVG9JbWFnZU1hcC5pY29uSWRUb0ltYWdlTWFwW2Fzc2V0LmFzc2V0SWNvbl07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0RGF0YTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBcclxuICAgIHB1YmxpYyBnZXRHZW9mZW5jZURhdGEoKTogbmcuSVByb21pc2U8YW55W10+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KFwiYXNzZXRzL2RhdGEvZ2VvZmVuY2UuanNvblwiKVxyXG4gICAgICAgIC50aGVuICgocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgIH0gZWxzZSB7IFxyXG4gICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFuZ3VsYXIubW9kdWxlKFwidnNzLnVpLm1hcHMuZGVtb1wiKS5zZXJ2aWNlKFwiTWFwU2VydmljZVwiLCBTYW1wbGVTZXJ2aWNlKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJtYXBzLmRlbW8ubW9kdWxlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm1hcHMuZGVtby5zZXJ2aWNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImFzc2V0Lm1vZGVsLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbm1vZHVsZSB2c3MudWkubWFwcy5kZW1vIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRGVtb0NvbnRyb2xsZXIge1xyXG4gICAgICAgIHB1YmxpYyBtYXBBc3NldHM6IEFzc2V0W107XHJcbiAgICAgICAgcHVibGljIGdlb2ZlbmNlOiBhbnlbXTtcclxuICAgICAgICBwdWJsaWMgY2VudGVyOiB7fTtcclxuICAgICAgICBwcml2YXRlIG1hcEFzc2V0c0V4dGVudHM6IG51bWJlcltdO1xyXG4gICAgICAgIHB1YmxpYyB2aWV3OiB7fTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLCBwcml2YXRlIE1hcFNlcnZpY2U6IElBc3NldFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5nZW9mZW5jZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogMzkuOTAxMjc1MSxcclxuICAgICAgICAgICAgICAgIGxvbjogLTEwNS4xMTAyODYzLFxyXG4gICAgICAgICAgICAgICAgem9vbTogNFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcgPSB7XHJcbiAgICAgICAgICAgICAgICBtaW5ab29tOiAxLjIsXHJcbiAgICAgICAgICAgICAgICBtYXhab29tOiAxNlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLm1hcEFzc2V0c0V4dGVudHMgPSBbMCwgMCwgMCwgMF07XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaERhdGEoKTtcclxuICAgICAgICAgICAgTWFwU2VydmljZS5nZXRHZW9mZW5jZURhdGEoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdlb2ZlbmNlID0gW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdlb0pTT05cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb2pzb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbjogXCJFUFNHOjM4NTdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInJnYmEoMjU1LCAwLCAwLCAwLjYpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVmcmVzaERhdGEoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuTWFwU2VydmljZS5nZXRNYXBBc3NldHMoKS50aGVuKChhc3NldHMpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFwQXNzZXRzID0gYXNzZXRzO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLnVwZGF0ZU1hcEV4dGVudHModGhpcy5tYXBBc3NldHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVNYXBFeHRlbnRzKG1hcEFzc2V0cykge1xyXG4gICAgICAgICAgICB0aGlzLm1hcEFzc2V0c0V4dGVudHNbMF0gPSBtYXBBc3NldHNbMF0ubGFzdFJlcG9ydGVkTG9jYXRpb25MYXRpdHVkZTtcclxuICAgICAgICAgICAgdGhpcy5tYXBBc3NldHNFeHRlbnRzWzJdID0gbWFwQXNzZXRzWzBdLmxhc3RSZXBvcnRlZExvY2F0aW9uTGF0aXR1ZGU7XHJcbiAgICAgICAgICAgIHRoaXMubWFwQXNzZXRzRXh0ZW50c1sxXSA9IG1hcEFzc2V0c1swXS5sYXN0UmVwb3J0ZWRMb2NhdGlvbkxvbmdpdHVkZTtcclxuICAgICAgICAgICAgdGhpcy5tYXBBc3NldHNFeHRlbnRzWzNdID0gbWFwQXNzZXRzWzBdLmxhc3RSZXBvcnRlZExvY2F0aW9uTG9uZ2l0dWRlO1xyXG5cclxuICAgICAgICAgICAgXy5mb3JFYWNoKDx2c3MudWkubWFwcy5kZW1vLkFzc2V0W10+bWFwQXNzZXRzLCAoYXNzZXQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhc3NldC5sYXN0UmVwb3J0ZWRMb2NhdGlvbkxhdGl0dWRlIDwgdGhpcy5tYXBBc3NldHNFeHRlbnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXBBc3NldHNFeHRlbnRzWzBdID0gYXNzZXQubGFzdFJlcG9ydGVkTG9jYXRpb25MYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhc3NldC5sYXN0UmVwb3J0ZWRMb2NhdGlvbkxvbmdpdHVkZSA8IHRoaXMubWFwQXNzZXRzRXh0ZW50c1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwQXNzZXRzRXh0ZW50c1sxXSA9IGFzc2V0Lmxhc3RSZXBvcnRlZExvY2F0aW9uTG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0Lmxhc3RSZXBvcnRlZExvY2F0aW9uTGF0aXR1ZGUgPiB0aGlzLm1hcEFzc2V0c0V4dGVudHNbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcEFzc2V0c0V4dGVudHNbMl0gPSBhc3NldC5sYXN0UmVwb3J0ZWRMb2NhdGlvbkxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0Lmxhc3RSZXBvcnRlZExvY2F0aW9uTG9uZ2l0dWRlID4gdGhpcy5tYXBBc3NldHNFeHRlbnRzWzNdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXBBc3NldHNFeHRlbnRzWzNdID0gYXNzZXQubGFzdFJlcG9ydGVkTG9jYXRpb25Mb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmNlbnRlcltcImxhdFwiXSA9ICh0aGlzLm1hcEFzc2V0c0V4dGVudHNbMl0gKyB0aGlzLm1hcEFzc2V0c0V4dGVudHNbMF0pIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJbXCJsb25cIl0gPSAodGhpcy5tYXBBc3NldHNFeHRlbnRzWzNdICsgdGhpcy5tYXBBc3NldHNFeHRlbnRzWzFdKSAvIDI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbnRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH1cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidnNzLnVpLm1hcHMuZGVtb1wiKS5jb250cm9sbGVyKFwiRGVtb0NvbnRyb2xsZXJcIiwgRGVtb0NvbnRyb2xsZXIpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
angular.module("vss.ui.maps").run(["$templateCache", function($templateCache) {$templateCache.put("demo/maps.demo.html","<div class=\"col-md-8 col-sm-12 col-xs-12 col-lg-8\"><div id=\"mapWidget\" class=\"panel panel-default dashboard-widget\"><div class=\"panel-heading panel-heading-with-buttons clearfix\"><h2 class=\"panel-title\">ALK + OL3 Map</h2></div><div class=\"panel-body\"><div class=\"vl-map\"><ol3-alk-map mapassets=\"vm.mapAssets\" center=\"vm.center\" view=\"vm.view\"></ol3-alk-map></div></div></div></div>");}]);