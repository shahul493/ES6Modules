'use strict';
(function (namespace, $, undefined) 
{
  /* 
  Google maps based info window/callout that shows details of a single dump or load, or a grouped dump or load.

  to use:
    var infoWindow = new VLLoadDumpInfoWindow.showInfoWindow(map, options);
  
  options:
    assetLocations: the load(s)/dump(s) whose details you want to show
    isLoad: true/false if assetLocations represents a load or dump
    isCycles: true/false
    marker: the google.maps.marker that the info window will be centered on
    zIndex: z-order of info window
    
  todo:
    if there are many work periods, then the rows extend below the info window's speech bubble.
    either cope with more rows by allowing the info window to scroll, or replace the google info window with a VisionLink styled one that supports scroll bars
  */
  
  var currentInfoWindow = null;
  var first = true;
  
  namespace.showInfoWindow = function (map, options)
  {
    this.hideLastInfoWindow();
    var iwOptions = { content: assembleHtml(options.assetLocations, options.isLoad, options.isCycles),
                    position: options.marker.getPosition(),
                    pixelOffset: new google.maps.Size(0, 0),
                    zIndex: options.zIndex };
    this.infoWindow = new google.maps.InfoWindow(iwOptions);

      this.infoWindow.open(map);
      currentInfoWindow = this.infoWindow;

      if (first)
      {
          //This is a kludge to make it display correctly. First time has 2 scrollbars.
          setTimeout(function(){
              first = false;
              VLLoadDumpInfoWindow.showInfoWindow(map, options);
          },300);
      }


  };
  
  namespace.hideLastInfoWindow = function ()
  {
    if (currentInfoWindow && currentInfoWindow.close)
    {
      currentInfoWindow.close();
      currentInfoWindow = null;
    }
  };
  
  function assembleHtml(assetLocations, isLoad, isCycles)
  {
    var detail;
    if (assetLocations.length <= 1)
    {
      detail = assembleHtmlForSingleLoadDump(assetLocations, isLoad, isCycles);
    }
    else
    {
      detail = assembleHtmlForGroupedLoadDump(assetLocations, isLoad, isCycles);
    }
    return encloseWithHeader(detail, isLoad).get(0);
  };
  
  function encloseWithHeader(detail, isLoad)
  {
    var headerText = getString(isLoad ? 'loadEvent' : 'dumpEvent');
    var header = $('<div>').addClass('infoWindowAssetNameContainer').addClass(isLoad ? 'assetLoadInfoWindow' : 'assetDumpInfoWindow').text(headerText);
    var content = $('<div>').addClass('infowindowBottomContainerLoadDump').append(detail);
    return $('<div>').addClass('infowindowContainer').append(header).append(content);
  };
  
  function assembleHtmlForSingleLoadDump(assetLocations, isLoad, isCycles)
  {
    var mald = assetLocations[0];
    var rows = [];
    var stats = statsForGroupedLoadDump([mald]);

    rows.push( { key: mald.assetLabelToDisplay, value: mald.assetNameToDisplay } );
    rows.push( { key: isCycles ? 'startTime' : 'loadTime', value: formatDisplayDate(mald.startUTC) } );
    rows.push( { key: isCycles ? 'cycleTime' : 'timePerLoad', value: secondsToDurationString(stats.totalDurationSeconds) } );
    rows.push( { key: isCycles ? 'cycleDistance' : 'distancePerLoad', value: formatDisplayBigDistance(stats.totalDistance) } );
    rows.push( { key: isCycles ? 'endTime' : 'dumpTime', value: formatDisplayDate(mald.stopUTC) } );
    rows.push( { key: 'idleTime', value: secondsToDurationString(mald.idleMinutes * 60.0) } );
    if (!isCycles)
    {
      if (!mald.startIsLoad) rows.push( { key: 'incompleteLoadNoLoad', value: null } );
      if (!mald.stopIsDump) rows.push( { key: 'incompleteLoadNoDump', value: null } );
    }
    if (mald.isOutlierDistance) rows.push( { heading: 'outsideExpectedDistance' } );
    if (mald.isOutlierTime) rows.push( { heading: 'outsideExpectedTime' } );
    if (mald.isOutlierLocation) rows.push( { heading: 'outsideExpectedLocation' } );
    
    if (mald.workPeriods && mald.workPeriods.length > 0)
    {
      rows.push( { heading: 'working' } );
      for (var n = 0; n < mald.workPeriods.list.source.length; n++)
      {
        var wp = mald.workPeriods.list.source[n];
        rows.push( { key: 'start', value: formatDisplayDate(wp.startUTC) } );
        rows.push( { key: 'stop', value: formatDisplayDate(wp.endUTC) } );
      }
    }                
    
    var table = $('<table class="noUserSelection infoWindow infoWindowKeyValuePairs">');
    appendKeyValueRowsToTable(rows, table);
    return table;
  };
  
  function assembleHtmlForGroupedLoadDump(assetLocations, isLoad, isCycles)
  {
    var mald = assetLocations[0];
    var rows = [];
    var stats = statsForGroupedLoadDump(assetLocations);

    rows.push( { key: mald.assetLabelToDisplay, value: mald.assetNameToDisplay } );
    rows.push( { key: isCycles ? 'cycles' : 'loadCounts', value: formatNumber(assetLocations.length, 0) } );
    rows.push( { key: isCycles ? 'avgCycleTime' : 'avgTimePerLoad', value: secondsToDurationString(stats.totalDurationSeconds / assetLocations.length) } );
    rows.push( { key: isCycles ? 'avgCycleDistance' : 'avgDistancePerLoad', value: formatDisplayBigDistance(stats.totalDistance / assetLocations.length) } );
    rows.push( { key: 'avgIdleTime', value: secondsToDurationString(stats.totalIdleMinutes * 60.0 / assetLocations.length) } );
    
    var table = $('<table class="noUserSelection infoWindow infoWindowKeyValuePairs">');
    appendKeyValueRowsToTable(rows, table);
    return table;
  };
  
  function statsForGroupedLoadDump(assetLocations)
  {
    var stats = { totalDistance: 0,
                  totalDurationSeconds: 0,
                  totalIdleMinutes: 0 };
    for (var n = 0; n < assetLocations.length; n++)
    {
      var mald = assetLocations[n];
      stats.totalDistance += mald.distanceMeters;
      var startUTC = new Date(mald.startUTC);
      var stopUTC = new Date(mald.stopUTC);
      stats.totalDurationSeconds += (stopUTC.getTime() - startUTC.getTime()) / 1000.0;
      stats.totalIdleMinutes += mald.idleMinutes;
    }
    return stats;
  };
  
  function secondsToDurationString(seconds)
  {
    var hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.floor(seconds);
    return (hours > 0 ? formatNumber(hours, 0) + 'h' : '') +
           (minutes > 0 ? minutes + 'm' : '') +
           (seconds > 0 ? seconds + 's' : '');
  };
  
  function appendKeyValueRowsToTable(rows, table)
  {
    for (var n = 0; n < rows.length; n++)
    {
      var row = rows[n];
      var label = getString(row.key);
      if (row.heading)
      {
        table.append($('<tr>').addClass('heading').append($('<td>').attr('colSpan', 2).text(getString(row.heading))));
      }
      else
      {
        label += row.value == null ? '' : ':';
        table.append($('<tr>').append($('<td>').text(label)).append($('<td>').text(row.value)));
      }
    }
  };
  
} (window.VLLoadDumpInfoWindow = window.VLLoadDumpInfoWindow || {}, jQuery));
