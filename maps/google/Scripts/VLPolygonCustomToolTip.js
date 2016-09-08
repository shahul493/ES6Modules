"use strict";
function CustomToolTip(opt_Options) {
  this.extend(CustomToolTip, google.maps.OverlayView);
  this.setValues(opt_Options);

  this.span_ = document.createElement('span');

  this.labelDiv_ = document.createElement('div');
  this.labelDiv_.appendChild(this.span_);
  this.labelDiv_.style.cssText = 'position: absolute; display: none';
  this.setStyles();
};

CustomToolTip.prototype.extend = function (obj1, obj2) {
  return (function (object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};

//Implement onAdd
CustomToolTip.prototype.onAdd = function () {

  var pane = this.getPanes().floatPane;
  pane.appendChild(this.labelDiv_);
};

//Implement onRemove
CustomToolTip.prototype.onRemove = function () {
  this.labelDiv_.parentNode.removeChild(this.labelDiv_);
};

// Implement draw
CustomToolTip.prototype.draw = function (latlng, text) {
  var projection = this.getProjection();
  if (projection) {
    var position = projection.fromLatLngToDivPixel(latlng);
    if (position != undefined) {
      var div = this.labelDiv_;
      div.style.left = position.x + 'px';
      div.style.top = (position.y + 20) + 'px';
      div.style.display = 'block';
  
      var zIndex = this.get('zIndex');
      div.style.zIndex = zIndex ? zIndex : 2000;
    }
  }
  if (typeof text !== 'undefined') {
    this.span_.innerHTML = text;
  }
};

CustomToolTip.prototype.hide = function () {
  var div = this.labelDiv_;
  div.style.display = 'none';
}


CustomToolTip.prototype.setStyles = function () {
  var labelClass = this.get("labelClass");

  // Apply style values from the style sheet defined in the labelClass parameter:
  if (labelClass != undefined)
    this.labelDiv_.className = labelClass;
};
