(function (namespace, $, undefined) {

    var SUMMARY_VOLUMES_PAGE = 29;
    var COVERAGE_PAGE = 19;
    var ELEVATION_PAGE = 20;
    var CMV_DETAIL_PAGE = 27;
    var CMV_SUMMARY_PAGE = 21;
    var PASSCOUNT_DETAIL_PAGE = 28;
    var PASSCOUNT_SUMMARY_PAGE = 22;
    var CUTFILL_PAGE = 23;
    var TEMPERATURE_PAGE = 37;
    var MDP_SUMMARY_PAGE = 43;
    var MONITORED_LOAD_DETAILS_PAGE = 41;
    var MONITORED_CYCLE_DETAILS_PAGE = 40;
    var CMV_CHANGE_PAGE = 62;

    var WORK_IN_PROGRESS = 3;
    var TOO_THICK = 4;
    
    var LEGEND_DIV_NAME = "map_legend";
    var LEGEND_CANVAS_NAME = "legend_canvas";
    
    var legendPage = null;
    var legendRectBoxes = null;
    var settings = null;
    var blackTick = null;
    var whiteTick = null;
    var loadImage = null;
    var dumpImage = null;

    namespace.drawLegend = function(map, pageId, projectSettings) { 
    
      //TODO: Use Modernizr to detect HTML5/CSS3 supported features in browser
      settings = projectSettings;
      
      var isIE = typeof G_vmlCanvasManager != 'undefined';
      var browserSupportsCanvas = isIE ? true : !!document.createElement("canvas").getContext;
      if (browserSupportsCanvas){
      
        //Use http://lunapic.com/editor/?action=load to create images with transparent backgrounds
        if (blackTick == null) {
            blackTick = new Image();
            blackTick.src = "images/BlackTick.png"; 
        }
        if (whiteTick == null) {
            whiteTick = new Image();
            whiteTick.src = "images/WhiteTick.png"; 
        }
        if (loadImage == null) {
            loadImage = new Image();
            loadImage.src = "images/Load white border.png"; 
        }        
        if (dumpImage == null) {
            dumpImage = new Image();
            dumpImage.src = "images/Dump white border.png"; 
        } 
                             
        var canvas;
        var ctx;
        var legendDiv = document.getElementById(LEGEND_DIV_NAME);
        if (legendDiv == null) { 
            legendDiv = document.createElement("div");
            legendDiv.id = LEGEND_DIV_NAME;
            canvas = document.createElement("canvas");
            if (isIE) { 
                canvas = G_vmlCanvasManager.initElement(canvas);  
            }
            canvas.id = LEGEND_CANVAS_NAME;
            legendDiv.appendChild(canvas);
            map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legendDiv); 
            if (canvas.addEventListener) {   
                canvas.addEventListener('click', onLegendClicked);
                canvas.addEventListener('mousemove', onLegendMouseMoved);
            }
            else if (canvas.attachEvent) { //IE
                canvas.attachEvent('onclick', onLegendClicked);
                canvas.attachEvent('onmousemove', onLegendMouseMoved);
            }
            else {
                console.log("Legend: failed to set up event listeners");
            }
            ctx = canvas.getContext("2d");
        }
        else {
            canvas = document.getElementById(LEGEND_CANVAS_NAME);
            ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }
         
        legendPage = pageId;
        switch (pageId) 
        {
            case SUMMARY_VOLUMES_PAGE:
                summaryVolumesLegend(canvas, ctx, settings);
                break;
            case COVERAGE_PAGE:
                coverageLegend(canvas, ctx, settings);
                break;
            case ELEVATION_PAGE:
                elevationLegend(canvas, ctx, settings);
                break;
            case CMV_DETAIL_PAGE:
                break;
            case CMV_SUMMARY_PAGE:
                cmvSummaryLegend(canvas, ctx, settings);
                break;
            case PASSCOUNT_DETAIL_PAGE:
                passcountDetailLegend(canvas, ctx, settings);
                break;
            case PASSCOUNT_SUMMARY_PAGE:
                passcountSummaryLegend(canvas, ctx, settings);
                break;
            case CUTFILL_PAGE:
                cutfillLegend(canvas, ctx, settings);
                break;
            case TEMPERATURE_PAGE:
                temperatureLegend(canvas, ctx, settings);
                break;
            case MDP_SUMMARY_PAGE:
                mdpSummaryLegend(canvas, ctx, settings);
                break;
            case MONITORED_LOAD_DETAILS_PAGE:
                loadDetailsLegend(canvas, ctx, settings);
                break;
            case MONITORED_CYCLE_DETAILS_PAGE:
                cycleDetailsLegend(canvas, ctx, settings);
                break;
            case CMV_CHANGE_PAGE:
                cmvChangeLegend(canvas, ctx, settings);
                break;
            default:
                break;
        }
      }
    };

    function onLegendMouseMoved(evt) {
        google.maps.event.trigger(map, vss.common.LegendEventType.LEGEND_MOUSE_MOVED, evt);
    }

    function onLegendClicked(evt) {
        var checkboxClicked = false;
        if (legendPage == CMV_SUMMARY_PAGE || legendPage == MDP_SUMMARY_PAGE) {
            var canvas = document.getElementById(LEGEND_CANVAS_NAME);
            var ctx = canvas.getContext("2d");
            var pos = windowToCanvas(canvas, evt.clientX, evt.clientY);
            if (legendRectBoxes[WORK_IN_PROGRESS].x1 <= pos.x && pos.x <= legendRectBoxes[WORK_IN_PROGRESS].x2 &&
                legendRectBoxes[WORK_IN_PROGRESS].y1 <= pos.y && pos.y <= legendRectBoxes[WORK_IN_PROGRESS].y2) {
                if (legendPage == CMV_SUMMARY_PAGE) {
                    settings.colorSettings.cmvSummarySettings.workInProgressLayerVisible = !settings.colorSettings.cmvSummarySettings.workInProgressLayerVisible;                   
                    legendCheckboxClicked(settings.colorSettings.cmvSummarySettings.workInProgressLayerVisible, WORK_IN_PROGRESS);
                }
                else {
                    settings.colorSettings.mdpSummarySettings.workInProgressLayerVisible = !settings.colorSettings.mdpSummarySettings.workInProgressLayerVisible;
                    legendCheckboxClicked(settings.colorSettings.mdpSummarySettings.workInProgressLayerVisible, WORK_IN_PROGRESS);
                }
                checkboxClicked = true;
            }
            else if (legendRectBoxes[TOO_THICK].x1 <= pos.x && pos.x <= legendRectBoxes[TOO_THICK].x2 &&
                     legendRectBoxes[TOO_THICK].y1 <= pos.y && pos.y <= legendRectBoxes[TOO_THICK].y2) {
               if (legendPage == CMV_SUMMARY_PAGE) {
                    settings.colorSettings.cmvSummarySettings.tooThickLayerVisible = !settings.colorSettings.cmvSummarySettings.tooThickLayerVisible;
                    legendCheckboxClicked(settings.colorSettings.cmvSummarySettings.tooThickLayerVisible, TOO_THICK);
                }
                else {
                    settings.colorSettings.mdpSummarySettings.tooThickLayerVisible = !settings.colorSettings.mdpSummarySettings.tooThickLayerVisible;
                    legendCheckboxClicked(settings.colorSettings.mdpSummarySettings.tooThickLayerVisible, TOO_THICK);
                }
                checkboxClicked = true;
            }
        }
        if (!checkboxClicked) {
            //Give click to map for drawing tools
            google.maps.event.trigger(map, vss.common.LegendEventType.LEGEND_CLICKED, evt);
        }
    }
    
    function windowToCanvas(c, x, y) {
        var bbox = c.getBoundingClientRect();
        var width = bbox.width == undefined ? bbox.right - bbox.left : bbox.width;
        var height = bbox.height == undefined ? bbox.bottom - bbox.top : bbox.height;
        return { x: x - bbox.left * (c.width / width),
                 y: y - bbox.top * (c.height / height) };
    }
    
    function getLegend(canvas, ctx, colors, labels, leftAlign, secondLabels, layersVisible) {
        //Set defaults for optional parameters
        leftAlign = leftAlign == undefined ? true : leftAlign;
        secondLabels = secondLabels == undefined ? null : secondLabels;
        layersVisible = layersVisible == undefined ? null : layersVisible;
        
        var LEGEND_CHECKBOX_WIDTH = 14;
        var ELEV_LEGEND_CHECKBOX_HEIGHT = 5;
        var LEGEND_GAP = 7;
        var LEGEND_ITEM_TEXT_WIDTH_PADDING = 5;
        var TOP_LEGEND_Y = 20;
        var FONT = "12px calibri";//Flex has 10px but need bigger to get white outline
        var BOLD_FONT = "bold " + FONT;
        
        //In Firefox this font assignment gives a NS_ERROR_FAILURE error the second time here. 
        //It can't be due to garbage collection of the canvas
        //(see https://bugzilla.mozilla.org/show_bug.cgi?id=490535) as I tried creating a new 
        //canvas with a new context and still got the problem.
        //29 Apr 2014: resolved by using visibility:hidden instead of display:none in flex when toggling the iframe
        var isIE = typeof G_vmlCanvasManager != 'undefined';    
        ctx.font = isIE ? FONT : BOLD_FONT;
        ctx.lineWidth = isIE ? 1 : 2;
        ctx.textBaseline = "top";
    
        //Find the maximum width string so we can left align them
        var maxWidth = maxTextWidth(ctx, labels);   
        var secondMaxWidth = maxTextWidth(ctx, secondLabels);
        
        var total = colors.length;
        var legendRectHeight = legendPage == ELEVATION_PAGE ? ELEV_LEGEND_CHECKBOX_HEIGHT : LEGEND_CHECKBOX_WIDTH;
        var legendHeightGap = legendPage == ELEVATION_PAGE ? 0 : LEGEND_GAP;
        var totalLegendHeight = TOP_LEGEND_Y + total * (legendRectHeight + legendHeightGap);
        if (legendPage == ELEVATION_PAGE) {
            totalLegendHeight += LEGEND_GAP;
        }
        
        canvas.width = maxWidth + secondMaxWidth + LEGEND_ITEM_TEXT_WIDTH_PADDING + LEGEND_CHECKBOX_WIDTH + LEGEND_GAP;
        canvas.height = totalLegendHeight;
        //Note setting the canvas width and height clears the canvas and resets all properties to defaults.
        //So set up font again.
        ctx.font = isIE ? FONT : BOLD_FONT;
        ctx.lineWidth = isIE ? 1 : 2;
        ctx.textBaseline = "top";
         
        ctx.strokeStyle = "white";
           
        var legendX = canvas.width - LEGEND_CHECKBOX_WIDTH - LEGEND_GAP;
        legendRectBoxes = [];
        for (i=0; i<total; i++) {
          var legendY = TOP_LEGEND_Y + i * (legendRectHeight + legendHeightGap);
          legendRectBoxes.push({x1:legendX, y1:legendY, x2:legendX + LEGEND_CHECKBOX_WIDTH, y2:legendY + legendRectHeight});
          if (legendPage == MONITORED_LOAD_DETAILS_PAGE || legendPage == MONITORED_CYCLE_DETAILS_PAGE) {
                //'colors' actually holds the images
                ctx.drawImage(colors[i], legendX, legendY);
          }
          else {
              ctx.fillStyle = VLMapUtil.colorNumberToHexString(colors[i]);
              ctx.fillRect(legendX, legendY, LEGEND_CHECKBOX_WIDTH, legendRectHeight);
              if (legendPage != ELEVATION_PAGE) {         
                ctx.strokeRect(legendX, legendY, LEGEND_CHECKBOX_WIDTH, legendRectHeight);
              }
              if (legendPage == CMV_SUMMARY_PAGE || legendPage == MDP_SUMMARY_PAGE) {
                if (layersVisible != null && layersVisible[i] == true) {
                    var tick = isDarkColor(colors[i]) ? whiteTick : blackTick;
                    ctx.drawImage(tick, legendX+1, legendY+1);
                } 
              }
          }
             
          ctx.fillStyle = "black"; //Set color for text
          var legendTextX;
          if (secondLabels != null) {
            if (secondLabels[i] != null && secondLabels[i] != "") {
              //Second column of labels is always right aligned (currently only used for cut/fill grades)
              legendTextX = legendX - LEGEND_ITEM_TEXT_WIDTH_PADDING;
              ctx.textAlign = "right";
              ctx.strokeText(secondLabels[i], legendTextX, legendY);
              ctx.fillText(secondLabels[i], legendTextX, legendY);
            }
          }
    
          if (labels[i] != null && labels[i] != "") {
            legendTextX = leftAlign ? 0 : legendX - secondMaxWidth - LEGEND_ITEM_TEXT_WIDTH_PADDING;
            ctx.textAlign = leftAlign ? "left" : "right";
            ctx.strokeText(labels[i], legendTextX, legendY);
            ctx.fillText(labels[i], legendTextX, legendY);
          }   
        }
        if (isIE) {
          ctx.fillText("", 0, 0); //forces last label to be drawn in IE 9. Without this line, the last label has the white outline but not the black fill
        }
    
        if (legendPage == ELEVATION_PAGE) {
            ctx.strokeRect(legendX, TOP_LEGEND_Y, LEGEND_CHECKBOX_WIDTH, legendRectHeight * total);
        }
    }
    
    function maxTextWidth(ctx, labels) {
      var maxWidth = 0;
      if (labels != null) {
        for (var i=0; i<labels.length; i++) {
            if (labels[i] != null && labels[i] != "") {
                var size = ctx.measureText(labels[i]);
                if (size.width > maxWidth) {
                    maxWidth = size.width;
                }              
            }
        }
      }
      return maxWidth;
    } 
    
    function isDarkColor(color) {      
        var THRESHOLD_LIMIT = 130; 
        
        var r = color >> 16 & 255;        
        var g = color >> 8 & 255; 
        var b = color >> 0 & 255; 
        var brightness = Math.sqrt(r*r*.241 + g*g*.691 + b*b*.068);
        //any value below THRESHOLD_LIMIT is considered dark
        return brightness < THRESHOLD_LIMIT;
    }
       
    function summaryVolumesLegend(canvas, ctx, settings) {
      var colors = [
                     settings.colorSettings.volSummarySettings.coverageColor,
                     settings.colorSettings.volSummarySettings.volumeCoverageColor,
                     settings.colorSettings.volSummarySettings.noChangeColor
                   ];

      var labels = [
                    getString("coverage"),
                    getString("volume"),
                    getString("noChange")
                   ];
      getLegend(canvas, ctx, colors, labels);    
    }
  
    function coverageLegend(canvas, ctx, settings) {  
      var colors = [
                     settings.colorSettings.coverageSettings.coverageColor,
                     settings.colorSettings.coverageSettings.surveyedSurfaceColor
                   ];

      var labels = [
                    getString("coverage"),
                    getString("surveyedSurface")
                   ];
      getLegend(canvas, ctx, colors, labels);
    }
  
    function elevationLegend(canvas, ctx, settings) {
      var colors = settings.elevationPalette;
      colors.reverse();

      var labels = [];
      labels.push(formatDisplayDistance(settings.colorSettings.elevSettings.colorSettings.maximum.value, 0));
      for (var i = 0; i < colors.length - 3; i++) {
        labels.push(null);
      }
      //This label is moved up a bit as the elevation legend rectangles are only 5 pixels high and the text height is larger
      labels.push(formatDisplayDistance(settings.colorSettings.elevSettings.colorSettings.minimum.value, 0));
      labels.push(null);

      if (!settings.colorSettings.elevSettings.setToDataExtents) {
        colors.unshift(settings.colorSettings.elevSettings.colorSettings.aboveColor);
        colors.push(settings.colorSettings.elevSettings.colorSettings.belowColor);

        labels.unshift(null);
        labels.push(null);
      }
      getLegend(canvas, ctx, colors, labels, false);
    }
  
    function cmvSummaryLegend(canvas, ctx, settings) {
      var colors = [
                     settings.colorSettings.cmvSummarySettings.overcompactedLayerColour, 
                     settings.colorSettings.cmvSummarySettings.completeLayerColour,
                     settings.colorSettings.cmvSummarySettings.undercompactedLayerColour,
                     settings.colorSettings.cmvSummarySettings.workInProgressLayerColour,
                     settings.colorSettings.cmvSummarySettings.tooThickLayerColour
                   ];
      var labels = [
                    getString("overcompactedLayer"),
                    getString("completeLayer"),
                    getString("undercompactedLayer"),
                    getString("workInProgress"),
                    getString("tooThickLayer")
                   ];
      var layersVisible = [
                            null,
                            null,
                            null,
                            settings.colorSettings.cmvSummarySettings.workInProgressLayerVisible,
                            settings.colorSettings.cmvSummarySettings.tooThickLayerVisible
                          ];            
      getLegend(canvas, ctx, colors, labels, true, null, layersVisible);
    }
  
    function passcountDetailLegend(canvas, ctx, settings) {
      var pcColors = settings.colorSettings.pcDetailSettings.passCountDetailColors.source;
      var colors = [];
      var labels = [];
      for (var i=0; i<pcColors.length; i++) {
        colors.push(pcColors[i].color);
        if (i == 0)
          labels.push(util.formatString(getString("passesMorethan"), formatNumber(pcColors[i + 1].value, 0)));
        else
          labels.push(formatNumber(pcColors[i].value, 0));
      }
      getLegend(canvas, ctx, colors, labels, false);
    }
  
    function passcountSummaryLegend(canvas, ctx, settings) {
      var colors = [
                     settings.colorSettings.pcSummarySettings.maximum.color, 
                     settings.colorSettings.pcSummarySettings.target.color,
                     settings.colorSettings.pcSummarySettings.minimum.color
                   ];

      var target = " " + getString("passTarget");
      var labels = [
                    getString("over") + target,
                    getString("equals") + target,
                    getString("under") + target
                   ];
      getLegend(canvas, ctx, colors, labels);
    }
  
    function cutfillLegend(canvas, ctx, settings) {
      var PRECISION = 3;
      var ON_GRADE_INDEX = 3;

      var cfColors = settings.colorSettings.cfSettings.cutFillColors.source;
      var colors = [];
      var gradeLabels = [];
      for (var i=0; i<cfColors.length; i++)
      {
        colors.push(cfColors[i].color);
        if (i == ON_GRADE_INDEX)
          gradeLabels.push(null);
        else
          gradeLabels.push(formatDisplayDistance(cfColors[i].value, PRECISION));
      }

      var labels = [
                    getString("cut"),
                    null,
                    null,
                    getString("onGrade"),
                    null,
                    null,
                    getString("fill")
                   ];
      getLegend(canvas, ctx, colors, labels, true, gradeLabels);
    }
  
    function temperatureLegend(canvas, ctx, settings) {
      var colors = [
                     settings.colorSettings.temperatureSettings.maximum, 
                     settings.colorSettings.temperatureSettings.target,
                     settings.colorSettings.temperatureSettings.minimum
                   ];

      var labels = [
                    getString("maxLevel"),
                    getString("withinLevels"),
                    getString("minLevel")
                   ];
      getLegend(canvas, ctx, colors, labels); 
    }
  
    function mdpSummaryLegend(canvas, ctx, settings) {
      var colors = [
                     settings.colorSettings.mdpSummarySettings.overcompactedLayerColour, 
                     settings.colorSettings.mdpSummarySettings.completeLayerColour,
                     settings.colorSettings.mdpSummarySettings.undercompactedLayerColour,
                     settings.colorSettings.mdpSummarySettings.workInProgressLayerColour,
                     settings.colorSettings.mdpSummarySettings.tooThickLayerColour
                   ];
      var labels = [
                    getString("overcompactedLayer"),
                    getString("completeLayer"),
                    getString("undercompactedLayer"),
                    getString("workInProgress"),
                    getString("tooThickLayer")
                   ];
      var layersVisible = [
                            null,
                            null,
                            null,
                            settings.colorSettings.mdpSummarySettings.workInProgressLayerVisible,
                            settings.colorSettings.mdpSummarySettings.tooThickLayerVisible
                          ];                    
      getLegend(canvas, ctx, colors, labels, true, null, layersVisible);
    }
  
    function loadDetailsLegend(canvas, ctx, settings) {
       var colors = [
                     loadImage,
                     dumpImage
                    ];

      var labels = [
                    getString("loadEvent"),
                    getString("dumpEvent")
                   ];
      getLegend(canvas, ctx, colors, labels);       
    }
  
    function cycleDetailsLegend(canvas, ctx, settings) {
      var colors = [
                     loadImage
                   ];

      var labels = [
                    getString("loadEvent")
                   ];
      getLegend(canvas, ctx, colors, labels);   
    }

    function cmvChangeLegend(canvas, ctx, settings) {
        var cmvChangeColors = settings.colorSettings.cmvPercentChangeSettings.cmvPercentChangeColors.source;
        var colors = [];
        var labels = [];
        for (var i=0; i<cmvChangeColors.length; i++) {
            colors.push(cmvChangeColors[i].color);
            if (isNaN(cmvChangeColors[i].value))
                labels.push(getString("moreThan") + ' ' + formatNumber(cmvChangeColors[i-1].value, 0)+ '%');
            else
                labels.push(formatNumber(cmvChangeColors[i].value, 0) + '%');
        }
        getLegend(canvas, ctx, colors, labels, false);
    }
    
  
} (window.VLProjectMapLegend = window.VLProjectMapLegend || {}, jQuery));