'use strict';
var vss = window.vss || {};
vss.geocoder = vss.geocoder || {};
(function(ns,jQuery, undefined){
ns.MapABCClientGeocoder =  function(_url, _key){
	this.url = _url;
	this.key = _key;
	this.geocode = function(lat, lng, callback)
	{
		var mapABCUrl = util.formatString(this.url, lng, lat, "1", this.key);
		jQuery.ajax({url : mapABCUrl}).done( function (data) { return callback(onSuccess(data));}).fail(function(error) { return callback("-");});
	};
	var onSuccess = function(data)
					{
					
						var fullAddress = "";
						if(data != null)
						{
							if(data.hasOwnProperty("SpatialBean"))
							{
								if(data.SpatialBean.Province)
								{
									fullAddress += data.SpatialBean.Province.name;					
								}
								fullAddress += " ";	
														
								if(data.SpatialBean.City)
								{
									fullAddress += data.SpatialBean.City.name;
								}
								fullAddress += " ";
								
								if(data.SpatialBean.District)
								{
									fullAddress += data.SpatialBean.District.name;
								}
								fullAddress += " ";	
													
								if(data.SpatialBean.roadList && typeof data.SpatialBean.roadList == 'array')
								{
									fullAddress += data.SpatialBean.roadList[0].name;
								}	
								fullAddress += " ";
								
								if ( data.SpatialBean.poiList && typeof data.SpatialBean.poiList == 'array')
								{
									fullAddress = fullAddress + "靠近" + data.SpatialBean.poiList[0].name + data.SpatialBean.poiList[0].address ;
								}
								else if ( data.SpatialBean.crossPoiList && typeof data.SpatialBean.crossPoiList == 'array')
								{
									fullAddress = fullAddress + "靠近" + data.SpatialBean.crossPoiList[0].name;
								}
							}
							else
							{
								fullAddress = "-";
							}
						}
						else
						{
							fullAddress = "-";
						}
						return fullAddress;
					};
	return this;
}
})(vss.geocoder, jQuery);
