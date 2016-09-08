'use strict';
var SearchControl = function(vlmap){
	var thisSearchControl = this;
	this.map = vlmap;
	this.marker;
	this.isAddedToMap = false; 
	

	this.findControl = util.createControlEle("div",'searchControl');
	this.findPop = util.createControlEle("div",'searchBox','searchBoxExtn'); 

	this.addressInput = util.createInputEle("text",'addressInput','mapMenuVerticalAlign');
	this.addressInput.placeholder = getString("searchLocation");
	this.findPop.appendChild(this.addressInput);
	
	this.searchButton = util.createControlEle("img",'searchButton','mapMenuVerticalAlign','images/view.png');
	this.findPop.appendChild(this.searchButton);

	this.closeButton = util.createControlEle("img",'searchIcon','mapMenuVerticalAlign','images/icon_map_close.png');
	this.closeButton.style.marginRight = "0px"
	this.findPop.appendChild(this.closeButton);

	this.findControl.appendChild(this.findPop);
	
	this.errorText = document.createTextNode("");
	var getRect = this.addressInput.getBoundingClientRect();
	this.invalidMessage = util.createControlEle("div","invalidMessageText","invalidMessageText");
	this.invalidMessage.appendChild(this.errorText);
	this.invalidMessage.className = 'errorToolTipLabel';
	this.invalidMessage.style.top = getRect.bottom + "35px";
	this.invalidMessage.style.left = getRect.left + "1px";
	this.findPop.appendChild(this.invalidMessage); 
	
	this.arrowDownIcon = util.createControlEle("img",'arrowDown','gapLeft','images/map_down_arrow.png');
	this.findButton = util.createControlEle("div","searchBtn","mapButton");
	
	var text = util.createControlEle("div","mapInfoText","mapButtonText");
	text.appendChild(document.createTextNode(getString("find")));
	text.appendChild(this.arrowDownIcon);
	this.findButton.appendChild(text); 
	this.findControl.appendChild(this.findButton); 

	this.geocoder = new google.maps.Geocoder();
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.findControl);

	util.addEvent(this.addressInput,"keypress",function(e){thisSearchControl.handleKeyPress(e)});
	util.addEvent(this.findButton,"click",function(){thisSearchControl.onSearchBtnClick()});
	util.addEvent(this.searchButton,"click",function(){thisSearchControl.codeAddress()});
	util.addEvent(this.closeButton,"click",function(){thisSearchControl.onCloseBtnClick()});
	util.addEvent(this.addressInput,"keydown",function(){thisSearchControl.onKeyDown()});
	util.addEvent(this.findControl,"mouseout",function(){thisSearchControl.onMouseOut()});
	util.addEvent(this.findControl,"mouseover",function(){thisSearchControl.onMouseOver()});
	util.addEvent(this.addressInput,"focus",function(){thisSearchControl.onFocus()});
	util.addEvent(this.addressInput,"blur",function(){thisSearchControl.onBlur()});
};

SearchControl.prototype = function(){
	var codeAddress = function (){
		  var that = this;
		  var addressTxt = this.addressInput.value;
		  if(addressTxt != this.addressInput.placeholder)
		  {
		  	this.geocoder.geocode( { 'address': addressTxt}, function(results, status) {
			 	if (status == google.maps.GeocoderStatus.OK)
				 	onGeoSuccess.call(that,results);
			 	else
			 		onGeoFail(that, status);

		  	});
		  }
	},
	onGeoSuccess = function(results){
		this.clearSearch();
		if(this.marker == null)
		{
			this.marker = new google.maps.Marker({
			 						map:this.map,
									icon:new google.maps.MarkerImage('images/searchLocationBalloon.png',									 
										new google.maps.Size(27, 34),
										new google.maps.Point(0,0),
										new google.maps.Point(9,34))
								  });
		}
		
		this.marker.setPosition(results[0].geometry.location);
		this.marker.setTitle(results[0].address_components[0].long_name);
		this.map.setCenter(results[0].geometry.location);
		this.map.fitBounds(results[0].geometry.viewport);
				
		 if(this.isAddedToMap == false)
		 {			 
		 	this.marker.setMap(this.map);		 	
		 }		
		  this.isAddedToMap = true;
	},
	onGeoFail = function(that, status){
         that.errorText.nodeValue = util.formatString(getString("geocodingFailure"),that.addressInput.value);
         that.invalidMessage.style.display = "inline-block";
	},
	handleKeyPress = function(e){
		var key=e.keyCode || e.which;
		if (key==13){
			codeAddress.call(this);
		}
	},
	onSearchBtnClick = function(){
		this.clearSearch();
		this.findPop.style.display = "inline-block";
		this.findButton.style.display = "none";
	},
	onCloseBtnClick = function(){
		this.clearSearch();
		this.findPop.style.display = "none";
		this.findButton.style.display = "inline-block";
		this.addressInput.value = "";
		this.onBlur();
	},
	resetSearchControl = function(){
		this.onCloseBtnClick();
		if(this.isAddedToMap == true)
		 {	
		 	this.marker.setMap(null);
		 	this.marker = null;	 	
			this.isAddedToMap = false;		 	
		 }	
	},
	onKeyUp = function(e){
		var key=e.keyCode || e.which;
		if (key==13){
			form.submit();
		}
	},
	onKeyDown = function() {
		this.clearSearch();
	},
	onMouseOver = function() {
		if(this.errorText.nodeValue!="")
			this.invalidMessage.style.display = "inline-block";
	},
	onMouseOut = function() {
		this.invalidMessage.style.display = "none";
	},
	onFocus = function() {
		var input = this.addressInput;
  		if (input.value == input.placeholder) {
    		input.value = "";
    		input.style.color = "#000";
    		input.style.fontStyle = "normal";
  		}
	},
	onBlur = function() {
		var input = this.addressInput;
  		if (input.value == '' || input.value == input.hasAttribute('placeholder')) {
    		input.value = input.placeholder;
    		input.style.color = "#ababab";
    		input.style.fontStyle = "italic";
  		}
	},
	clearSearch = function() {
		this.errorText.nodeValue = "";
		this.invalidMessage.style.display = "none";
	};

	 return {
		onSearchBtnClick:onSearchBtnClick,
		onCloseBtnClick:onCloseBtnClick,
		codeAddress:codeAddress,
		handleKeyPress:handleKeyPress,
		resetSearchControl:resetSearchControl,
		onKeyDown:onKeyDown,
		onMouseOut:onMouseOut,
		onMouseOver:onMouseOver,
		onFocus:onFocus,
		onBlur:onBlur,
		clearSearch:clearSearch
    };

} ();
