var vss = window.vss || {};
vss.maptype = vss.maptype || {};

vss.maptype.NavInfoMapType = function(baseUrl){
	var getNormalizedCoord = function (coord, zoom) {
														  var y = coord.y;
														  var x = coord.x;
														
														  // tile range in one direction range is dependent on zoom level
														  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
														  var tileRange = 1 << zoom;
														
														  // don't repeat across y-axis (vertically)
														  if (y < 0 || y >= tileRange) {
														    return null;
														  }
														
														  // repeat across x-axis
														  if (x < 0 || x >= tileRange) {
														    x = (x % tileRange + tileRange) % tileRange;
														  }
														
														  return {
														    x: x,
														    y: y
														  };
														}
	var mapTypeOptions = {
							  getTileUrl: function(coord, zoom) {
																	var normalizedCoord = getNormalizedCoord(coord, zoom);
																	if (!normalizedCoord) {
																		return null;
																	} 
																	var url = baseUrl;
																	
																	if(zoom <= 6)
																	{
																		url = url + zoom + "/" + zoom + "-" + normalizedCoord.x + "-" + normalizedCoord.y + ".png";
																	}
																	else
																	 {
																		var dir = Math.pow(2, (zoom-5));
																		var rowDir = "R" + Math.floor(normalizedCoord.y / dir);
																		var colDir = "C" + Math.floor(normalizedCoord.x / dir);
																		url = url + zoom + "/" + rowDir + "/" + colDir + "/" + zoom + "-" + normalizedCoord.x + "-" + normalizedCoord.y + ".png";
																	}  
																	return url;
							  									},
							  tileSize: new google.maps.Size(256, 256),
							  maxZoom: 17,
							  minZoom: 0,
							  name: 'ChinaNavInfoMap'
							};
  return new google.maps.ImageMapType(mapTypeOptions)
};
