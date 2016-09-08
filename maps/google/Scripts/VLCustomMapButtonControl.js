"use strict";
function CustomButtonControl(controlDiv, strLabel, map) {
  controlDiv.style.padding = '5px';
  var controlUI = document.createElement('div');  
  controlUI.setAttribute("unselectable", "on"); // For IE and Opera  
  controlUI.style.backgroundColor = '#ffffff';
  controlUI.style.border = '1px solid';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';  
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');    
  controlText.style.fontSize = '10px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';  
  controlText.innerHTML = '<b>' + strLabel + '<b>'
  controlUI.appendChild(controlText);


  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);

  this.controlDiv_ = controlDiv;  
  this.AddToMap(map);
    
  this.hide();
};

CustomButtonControl.prototype.AddToMap = function (map) {
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.controlDiv_);
};

CustomButtonControl.prototype.show = function () {
  this.controlDiv_.style.display = 'block';
};

CustomButtonControl.prototype.hide = function () {
  this.controlDiv_.style.display = 'none';
};

CustomButtonControl.prototype.RemoveFromMap = function (map) {
  map.controls[google.maps.ControlPosition.TOP_LEFT].pop();
}