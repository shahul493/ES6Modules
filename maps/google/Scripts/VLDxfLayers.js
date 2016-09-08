(function (namespace, $, undefined) {

    var dxfMapTypes = {};//Dictionary indexed by file name

    namespace.clearDxfLayers = function () {
        dxfMapTypes = {};
    }


    namespace.addDxfFiles = function(dxfFiles, baseUrl, dxfParams, projection) {
        //try { 
          for (var i=0; i<dxfFiles.length; i++) {

              var dxfUrl = baseUrl;
              var params = jQuery.extend({}, constants.WMS_PARAMS,
                  {
                      REQUEST: "GetDesign",
                      //Our custom params
                      CUSTOMERID: dxfParams.customerid,
                      PROJECTID: dxfParams.projectid,
                      SESSIONID: dxfParams.sessionid,
                      DXFFILENAME: dxfFiles[i].mapFileName,
                      MAXZOOM: dxfFiles[i].maxZoom,
                      FILECREATEDUTC: dxfFiles[i].createdUTC
                  });

              for (var p in params) {
                  if (params.hasOwnProperty(p)) {
                      dxfUrl += "&" + p + "=" + params[p];
                  }
              }

              var dxfOpacity = dxfFiles[i].opacity;
              var dxfFileName = dxfFiles[i].name;
              var dxfMinZoom = dxfFiles[i].minZoom <= 0 ? 1 : dxfFiles[i].minZoom;
              var dxfMinLat = dxfFiles[i].minLat;
              var dxfMinLon = dxfFiles[i].minLon;
              var dxfMaxLat = dxfFiles[i].maxLat;
              var dxfMaxLon = dxfFiles[i].maxLon;

              var dxfMapType = new google.maps.ImageMapType
              (
                  {
                      getTileUrl: function (coord, zoom) {
                          var numTiles = 1 << zoom;
                          var normalizedCoord = VLMapUtil.getNormalizedCoord(coord, numTiles);
                          if (!normalizedCoord) { return null; }

                          if (!isNaN(this.extents.minLat) && !isNaN(this.extents.minLon) && !isNaN(this.extents.maxLat) && !isNaN(this.extents.maxLon)) {
                              var bbox = VLMapUtil.tileBoundingBox(normalizedCoord.x, normalizedCoord.y, numTiles, projection);
                              //See if this tile overlaps dxf file bounds
                              //Because we are using Mercator projection and global mapper may have used some other projection
                              //when generating tiles, make some allowance for differences, especially as this is just an optimisation
                              //to avoid sending numerous unnecessary calls to the server
                              var allowance = 0.002;
                              var noOverlap = (bbox.trLng + allowance) < this.extents.minLng ||
                                              (bbox.trLat + allowance) < this.extents.minLat ||
                                              (bbox.blLng - allowance) > this.extents.maxLng ||
                                              (bbox.blLat - allowance) > this.extents.maxLat;
                              if (noOverlap)
                                  return null;
                          }

                          var url = this.dxfUrl + "&ZOOM=" + zoom + "&XTILE=" + normalizedCoord.x + "&YTILE=" + normalizedCoord.y;
                          return url;
                      },

                      alt: dxfFileName,
                      tileSize: new google.maps.Size(constants.TILE_SIZE, constants.TILE_SIZE),
                      isPng: true,
                      maxZoom: constants.MAX_ZOOM,//wms service scales tiles from dxfMaxZoom to constants.MAX_ZOOM
                      minZoom: dxfMinZoom,
                      opacity: dxfOpacity,
                      name: dxfFileName,
                      extents: {minLat:dxfMinLat, minLng:dxfMinLon, maxLat:dxfMaxLat, maxLng:dxfMaxLon},
                      dxfUrl: dxfUrl
                  }
              );
              if (dxfFiles[i].visible) {
                map.overlayMapTypes.push(dxfMapType);
              }
              dxfMapType.projection = projection;
              dxfMapTypes[dxfFileName] = dxfMapType;
          }
        //} catch (e) { console.log(e); }   
    }
    
    namespace.deleteDxfFiles = function(dxfFileList) {
        //try {
          for (var i=0; i<dxfFileList.length; i++) {
            var dxfFileName = dxfFileList[i].name;   
            if (dxfMapTypes[dxfFileName] === undefined) {
                //console.log("Cannot delete dxf file " + dxfFileName + ". Missing dxf file in dxfMapTypes");
            }
            else {
                var indx = findDxfOverlay(dxfFileName);          
                if (indx != -1) {
                  map.overlayMapTypes.removeAt(indx);  
                }
                delete dxfMapTypes[dxfFileName];   
            }
          }      
        //} catch (e) { console.log(e); }   
    }
    
    namespace.updateDxfFile = function(dxfFile) {
        //try {  
            if (dxfMapTypes[dxfFile.name] === undefined) {
                //console.log("Cannot update dxf file " + dxfFile.name + ". Missing dxf file in dxfMapTypes");
            }
            else {
                dxfMapTypes[dxfFile.name].setOpacity(dxfFile.opacity);
                var indx = findDxfOverlay(dxfFile.name);
                if (indx != -1) {
                    if (!dxfFile.visible) {
                         map.overlayMapTypes.removeAt(indx);
                    }               
                }
                else {
                    if (dxfFile.visible) {
                        map.overlayMapTypes.push(dxfMapTypes[dxfFile.name]);
                    }
                }
            }
        //} catch (e) { console.log(e); }   
    }
    
    function findDxfOverlay(dxfFileName) {
        for (var i=0; i<map.overlayMapTypes.length; i++) {
            if (i != constants.WMS_INDEX && map.overlayMapTypes.getAt(i).name == dxfFileName) {
                return i;
            }
        }
        return -1;
    }
    


} (window.VLDxfLayers = window.VLDxfLayers || {}, jQuery));