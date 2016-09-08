var constants = new (function () {
  return {
  //Site polygons  
  SITE_FILL_OPACITY: 0.25,
  SITE_STROKE_OPACITY: 0.45,
  SITE_STROKE_WEIGHT: 2,
  
  //Project polygons
  PROJECT_STROKE_WEIGHT: 4,
  PROJECT_COLOR: '#FF8000',
  
  //Monitored site polygons
  HIGHLIGHTED_COLOR: '#800080',
  HIGHLIGHTED_STROKE_WEIGHT: 6,
  
  //Project map layers
  MAX_ZOOM:  24, 
  TILE_SIZE: 256,
  WMS_INDEX: 0,
  
  //Project map tools
  PROFILE_MARKER_SIZE: 16,
  MAP_TOOL_COLOR: '#269FFF',
  FILTER_TOOL_COLOR: 'red',
  PROFILE_TOOL_COLOR: 'red',
  MAP_TOOL_LINEWIDTH: 3,
  FILTER_TOOL_LINEWIDTH: 1,
  PROFILE_TOOL_LINEWIDTH: 1,
  
  //Use http://www.cursor.cc/ to create a cursor file from an image  
  DRAW_CURSOR_URL: 'url(images/DrawCursor.cur), url(images/DrawCursor.png) 0 15, crosshair',
  MEASURE_CURSOR_URL: 'url(images/MeasureCursor.cur), url(images/MeasureCursor.png), crosshair',
  MOVE_CURSOR_URL: 'url(images/MoveCursor.cur), url(images/MoveCursor.png), move',
  RESIZE_CURSOR_URL: 'url(images/ResizeCursor.cur), url(images/ResizeCursor.png), nesw-resize',

  //Max zoom on setCenter of Fleet and Dashboard map
  MAX_ZOOM_ON_SEARCH: 18,
  
  //Marker cluster default options
  MARKER_CLUSTERER_OPTIONS: { maxZoom: 14,
                              gridSize: 60,
                              ignoreHidden: true,
                              styles: [ { url: 'images/ClusterImage.png',
                                          height: 24,
                                          width: 50,
                                          textAlign:'center',
                                          textIndent:-12,
                                          textColor: '#000000',
                                          textSize: 12 },
                                          { url: 'images/ClusterImage.png',
                                          height: 24,
                                          width: 50,
                                          textAlign:'center',
                                          textIndent:-12,
                                          textColor: '#000000',
                                          textSize: 12 },
                                          { url: 'images/ClusterImage.png',
                                          height: 24,
                                          width: 50,
                                          textAlign:'center',
                                          textIndent:-12,
                                          textColor: '#000000',
                                          textSize: 12 },
                                          { url: 'images/ClusterImage.png',
                                          height: 24,
                                          width: 50,
                                          textAlign:'center',
                                          textIndent:-12,
                                          textColor: '#000000',
                                          textSize: 12 },
                                          { url: 'images/ClusterImageExtended.png',
                                          height: 24,
                                          width: 50,
                                          textAlign:'center',
                                          textIndent:-12,
                                          textColor: '#000000',
                                          textSize: 12 } ] },
  
  //prevent icons for schools, buildings and other places of interest from appearing on maps                                        
  MAP_STYLES_OPTION: [ { featureType: "poi",      stylers: [ { visibility: "off" } ] },
                       { featureType: "poi.park", stylers: [ { visibility: "on"  } ] } ],                                          
  
  //MAP INFO MENU  
  RADIO:"radio",
  CHECK:"checkBox",
  SEPARATOR:"separator",
  NORMAL:"normal",

  MAP_TYPE:"MapType",
  MAP_INFO:"MapInfoMenu",
  LABEL_MENU:"LabelMenu",
  NAV_LABEL:"NavLabel",
  DETAILS_MENU:"DetailsMenu",
  FIND_MENU:"Find",
  MAP_TOOLS:"MapTools",
  COORDS_MENU:"CoordsMenu",
  ALL_ASSETS:"AllAssets",

  MEASURE_TOOL:"Measure",
  AREA_TOOL:"Area",
  COORDS_TOOL:"Coords",
  PRODUCTION_DATA_TOOL:"Production",
  ASSETS_TOOL:"Assets",
  CELL_DETAILS_TOOL:"CellDetails",
  FILL_TOOL:"Fill",

  NoCoords:"none",
  LatLong:"latLong",
  DMS:"degreesMinutesSeconds",
  NE:"northingEasting",

  WMS_PARAMS: {
      VERSION: "1.3.0",
      LAYERS: "Layers",
      STYLES: "",
      FORMAT: "image/png",
      SERVICENAME: "VSS",
      SRS: "EPSG:4326",
      TRANSPARENT: true
  },
  
  MAX_ZONE_RADIUS_IN_METERS:2500000,
  MIN_ZONE_RADIUS_IN_METERS:1000,
  NEW_ZONE_BORDER_COLOR:'#0099FF',
  INCLUSION_ZONE_BORDER_COLOR:'#00FF00',
  EXCLUSION_ZONE_BORDER_COLOR:'#FF0000',
  EARTHS_RADIUS_IN_METERS:6378137       
  }; 
})();

var vss = window.vss || {};
vss.common = vss.common || {};
vss.common.EnumAssetLabelPreferenceType = (function(){ 
												return {
														AssetID			:	1,
														SerialNumber	:	2,
														Both			:	3,
														showAssetID 	: function(assetLabelPreferenceID){
																				return assetLabelPreferenceID == this.AssetID || assetLabelPreferenceID == this.Both;
																			},
														showSerialNumber: function(assetLabelPreferenceID){
																				return assetLabelPreferenceID == this.SerialNumber || assetLabelPreferenceID == this.Both;
																			}
														};
											})();

vss.common.EnumMeterLabelPreferenceType = (function(){
												return {
														Both			:	0,
														HourMeter		:	1,
														Mileage			:	2,
														showHourMeter 	: function(meterLabelPreferenceID){
																				return meterLabelPreferenceID == this.HourMeter || meterLabelPreferenceID == this.Both;
																			},
														showMileage		: function(meterLabelPreferenceID){
																				return meterLabelPreferenceID == this.Mileage || meterLabelPreferenceID == this.Both;
																			}
														};
											})();
vss.common.MapTypeId = 	(function(){ 
                                return {
                                        NAV_INFO_MAP  :   "navInfo"                                                                               
                                        };																				
					     })();

vss.common.EnumMapType = (function(){ 
								return {
										MAP			:	1,
										SATELLITE	:	2,
										HYBRID			:	3,
										TERRAIN			:	4,
										NAV_INFO_MAP	:	5,
										GOOGLE_MAP		:	6,
										GOOGLE_SATELLITE:	7,
										UNKNOWN			:	8,
										getGoogleMapType : function(vlMapTypeID){
																var mapTypeId = google.maps.MapTypeId.ROADMAP;
																if (vlMapTypeID == this.TERRAIN) {
															        mapTypeId = google.maps.MapTypeId.TERRAIN;
															      }
															      else if (vlMapTypeID == this.SATELLITE) {
															        mapTypeId = google.maps.MapTypeId.SATELLITE;
															      }
															      else if (vlMapTypeID == this.HYBRID) {
															        mapTypeId = google.maps.MapTypeId.HYBRID;
															      }
															      else if(vlMapTypeID == this.NAV_INFO_MAP) {
															      	mapTypeId = vss.common.MapTypeId.NAV_INFO_MAP;
															      }
															     return mapTypeId;
															}
																				
										};
								    })();
										
vss.common.EnumApplicationPageType = (function(){ 
                                return {
                                    STANDARD_PAGE            :   0,
                                    TWOD_MONITORING_PAGE     :   1,
                                    THREED_MONITORING_PAGE   :   2,
                                    MASSHAUL_MONITORING_PAGE :   3
                                        };																				
							})();
							
vss.common.EnumSiteType = (function(){ 
                                return {
                                        GENERIC_SITE    :   0,
                                        PROJECT_SITE    :   1,
                                        BORROW_SITE     :   2,                                                                                
                                        WASTE_SITE      :   3,                                                                                
                                        AVOIDANCE_ZONE  :   4,                                                                                
                                        STOCKPILE       :   5,                                                                                
                                        CUT_ZONE        :   6,                                                                                
                                        FILL_ZONE       :   7,
                                        IMPORT        	:  	8,                                                                                
                                        EXPORT       	:   9                                                                                
                                        };                                                                              
                            })();
                            
vss.common.EnumCoordDisplayType = (function(){ 
                                return {
                                        NO_COORDS :   0,
                                        LAT_LONG  :   1,
                                        DMS       :   2, //degrees, minutes, seconds
                                        NE        :   3  //northing, easting
                                        };                                                                              
                            })();
                            
vss.common.MapOptionsEventType = 	(function(){ 
								return {								   
										  ASSET_LABEL_PREFERENCE_CHANGED		: "assetLabelPreferenceChanged",
										  METER_LABEL_PREFERENCE_CHANGED		: "meterLabelPreferenceChanged",
										  LANGUAGE_CHANGED						: "languageChanged",
										  MAP_TYPE_CHANGED						: "mapTypeChanged",
										  ALLASSET_SELECTION_CHANGED			: "allAssetSelectionChanged"																	
										};										
							})();
													
vss.common.InfoWindowEventType =	(function(){ 
								return {								   
										  CLOSE_INFO_WINDOW	: "closeInfoWindow"																	
										};										
							})();

vss.common.LegendEventType =	(function(){
    return {
        LEGEND_CLICKED	    : "legendClicked",
        LEGEND_MOUSE_MOVED  : "legendMouseMoved"
    };
})();