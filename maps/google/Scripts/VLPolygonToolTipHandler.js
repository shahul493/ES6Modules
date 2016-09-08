var tooltipTimerMousePaused = null;
var tooltipTimerHintExpired = null;
var lastMouseMovePosition = null;
var tooltip = null;

 function onMouseMove(evt) {
	
    if (!loading) {
      //IE9 sends multiple mouse move events when there is no movement. Workaround to check that the mouse actually moved from the last point
      if (lastMouseMovePosition == null || !lastMouseMovePosition.equals(evt.latLng)) {
        lastMouseMovePosition = evt.latLng;
        tooltipMouseMoved(evt.latLng);
      }
    }
  }

  function onMouseOut(evt) {    
    if (!loading) {      
      hideTooltip();
    }
  }
    
  //Tooltip functionality
  function showTooltip(text, point) {
    if (tooltip == null) {
      tooltip = new CustomToolTip({ labelClass: "toolTipLabel" });
      tooltip.setOptions({ map: map });
    }
    tooltip.draw(point, text);
    if (tooltipTimerHintExpired != null) {
      clearTimeout(tooltipTimerHintExpired);
    }
    tooltipTimerHintExpired = setTimeout(hideTooltip, 3000);
  }

  function hideTooltip() {
    if (tooltip != null) {
      tooltip.hide();
    }
    if (tooltipTimerMousePaused != null) {
      clearTimeout(tooltipTimerMousePaused);
      tooltipTimerMousePaused = null;
    }
  }  

  function tooltipDueAtPoint(point) {    
    var text = vlSite.textForTooltipAtPoint(point);
    if (text == null) {
      hideTooltip();
    } else {      
      showTooltip(text, point);
    }
  }

  function tooltipMouseMoved(point) {
    hideTooltip();
    if (point != null) {
      tooltipTimerMousePaused = setTimeout(function () { tooltipDueAtPoint(point); }, 600);
    }
  } 	