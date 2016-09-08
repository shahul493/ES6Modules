'use strict';
(function (namespace, $, undefined) 
{
  /* 
  Generic map marker with html content, optionally enclosed in a speech bubble.

  to use:
    var marker = new VLCustomMarker.CustomMarker(map, options);
  
  options:
    sitePoint: location as lat/lng (flex coordinates)
    html: a string containing html to appear in the map marker. eg '<img src="images/AssetIcons/ForestMachine.png" style="width: 45px; height: 20px;">'
    useSpeechBubble: true/false - when true encloses the html with the speech bubble found at images/MapIconExpand.png
    click: function to call when the user clicks on the marker. eg function(e) { alert('clicked'); }. Inside the callback, "this" refers to the marker
    origin: x and y pixel offset from top left corner of html (ignored when useSpeechBubble is true)
    zIndex: z-order of map marker

  notes:    
    to remember an associated runtime object, just add to options. eg options.userData = myObject. Retrieve using this.options.userData inside the click handler
  */
  
  var SPEECH_BUBBLE = { loadUrl: 'images/MapIconExpandMagenta.png',
                        dumpUrl: 'images/MapIconExpandCyan.png',
                        width: 70, 
                        height: 44, 
                        border: { top: 5, right: 20, bottom: 19, left: 7 }, 
                        origin: { x: 1, y: 42 } };

  namespace.CustomMarker = function (map, markerOptions)
  {
    this.latLng = new google.maps.LatLng(markerOptions.sitePoint.lat, markerOptions.sitePoint.lng);
    this.options = markerOptions;
    this.htmlNode = null;
    this.setMap(map); //causes draw to be called
  };

  namespace.CustomMarker.prototype = new google.maps.OverlayView();

  namespace.CustomMarker.prototype.draw = function() 
  {
    if (this.htmlNode == null)
    {
      //create the html and add it to the DOM
      if (this.options.useSpeechBubble)
      {
        this.htmlNode = this.speechBubbleWithContent(this.options.html, this.options.data.isLoad);
      }
      else
      {
        this.htmlNode = $(this.options.html).get(0);
      }

      if (this.options.click)
      {
        var that = this;
        google.maps.event.addDomListener(this.htmlNode, 'click', function(event) {
          that.options.click.call(that);
        });
      }
      var panes = this.getPanes();
      panes.overlayImage.appendChild(this.htmlNode);
    }

    //position the marker
    var point = this.getProjection().fromLatLngToDivPixel(this.latLng);
    if (point) 
    {
      if (this.options.useSpeechBubble)
      {
        point.x -= SPEECH_BUBBLE.origin.x;
        point.y -= SPEECH_BUBBLE.origin.y;
      }
      else
      if (this.options.origin)
      {
        point.x -= origin.x;
        point.y -= origin.y;
      }
      var css = { position: 'absolute', 
                  left: point.x + 'px', 
                  top: point.y + 'px' };
      if (this.options.zIndex)
      {
        css.zIndex = this.options.zIndex;
      }
      $(this.htmlNode).css(css);
    }
  };
  
  namespace.CustomMarker.prototype.speechBubbleWithContent = function(htmlContent, isLoad)
  {
    //enclose the html string in a speech bubble image (the bubble is the background of a div, and an inner div is used to wrap the content)
    var url = isLoad ? SPEECH_BUBBLE.loadUrl : SPEECH_BUBBLE.dumpUrl;
    var css = { width: (SPEECH_BUBBLE.width - SPEECH_BUBBLE.border.left - SPEECH_BUBBLE.border.right) + 'px', 
                height: (SPEECH_BUBBLE.height - SPEECH_BUBBLE.border.top - SPEECH_BUBBLE.border.bottom) + 'px', 
                background: 'transparent url(' + url + ') no-repeat 0 0', 
                padding: SPEECH_BUBBLE.border.top + 'px ' + SPEECH_BUBBLE.border.right + 'px ' + SPEECH_BUBBLE.border.bottom + 'px ' + SPEECH_BUBBLE.border.left + 'px' };
    var div = $('<div>').addClass('noUserSelection').css(css);
    $('<div>').css( { overflow: 'hidden' } ).html(htmlContent).appendTo(div);
    return div.get(0);
  };

  namespace.CustomMarker.prototype.remove = function() 
  {
    //marker is being removed from the map, so clear out the inner html. NB: this is called as part of myMarker.setMap(null)
    if (this.htmlNode)
    {
      this.htmlNode.parentNode.removeChild(this.htmlNode);
      this.htmlNode = null;
    }
  };

  namespace.CustomMarker.prototype.getPosition = function() 
  {
    return this.latLng;
  };

} (window.VLCustomMarker = window.VLCustomMarker || {}, jQuery));
