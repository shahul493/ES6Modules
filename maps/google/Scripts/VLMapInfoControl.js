'use strict';
(function (namespace, $, undefined) {
	var map_;
	var mapMenuOptions;
	
	//Store option values
	var labelDetailOptions;
	var selectedMapToolItems;
	var isAllAssetsSelected;
	var mapType;
	
	//Items Visibility
	var showMaptype;
	var showAllAssets;
	var showLabels;
	var showDetails;
	var showMapTools;
	var showSiteFill;
	var showDesign;
	var showNavInfoMapType;
	
	//CallBack functions
	var mapTypeChangeFn;
	var labelDetailChangeFn;
	var allAssetsChangeFn;
	var mapToolChangeFn;
	
	//UI Elements
	var swingbox;
	var mainUL;
	var coordUL;
	var labelUL;
	var detailUL;
	var subMenu;
	
	namespace.MapInfoControl = function(map,mapMenuOptions){
		map_ = map;
		mapMenuOptions = mapMenuOptions;
		labelDetailOptions = map.vlMapOptions.labelDetailOptions;
		showNavInfoMapType = map.vlMapOptions.showNavInfoMapType;
		selectedMapToolItems = mapMenuOptions.mapToolMenuSelections;		
		isAllAssetsSelected = mapMenuOptions.isAllAssetsSelected;
	
		mapTypeChangeFn = mapMenuOptions.mapTypeChangeFn;
		labelDetailChangeFn = mapMenuOptions.labelDetailChangeFn;
		allAssetsChangeFn = mapMenuOptions.allAssetsChangeFn;
		mapToolChangeFn = mapMenuOptions.mapToolChangeFn;
	
		showMaptype  = mapMenuOptions.showMaptype;
		showAllAssets  = mapMenuOptions.showAllAssets;
		showLabels  = mapMenuOptions.showLabels;
		showDetails  = mapMenuOptions.showDetails;
		showMapTools  = mapMenuOptions.showMapTools;
		showSiteFill  = mapMenuOptions.showSiteFill;
		showDesign = mapMenuOptions.showDesign;
		  
		swingbox = util.createControlEle("div","mapInfoPanel","swingbox");
		createMenu();
	 
			var outer = util.createControlEle("div","controlPanel","firstMapButton");
			var inner = util.createControlEle("div","menu_inner","mapButton");
			var arrowDown = util.createControlEle("img","arrowDown","mapMenuVerticalAlign","images/map_down_arrow.png");
			arrowDown.className = "gapLeft";
			var text = util.createControlEle("div","mapInfoText","mapButtonText");
			text.appendChild(document.createTextNode(getString("mapInfo")));
			text.appendChild(arrowDown);
			inner.appendChild(text);
			outer.appendChild(inner);
			inner.appendChild(swingbox);
	
		$(text).click(toggleMenu);
		$(outer).on("mouseover", "li", null, function(){ mouseOverMenuItem($(this)); });
		$(outer).on("mouseout", "ul", null, mouseOutMenu);
		google.maps.event.addListener(map, "mousedown", hideMenu);
	
		if (window.attachEvent && !window.addEventListener) {
			// for IE
			$(swingbox).click(function (event) {
				var target = $(event.target);
				var selectedInput = target[0].previousSibling;
				if(selectedInput && selectedInput.nodeName=="INPUT" && !selectedInput.disabled)
				{
					util.ieInputSelectionHandlerCheck(target);
				onMenuChange(selectedInput.name,selectedInput.data);
				}
			});
	
		}else
		{
			$(swingbox).on("click", "input", function (event) {
				var target = $(event.target);
				if (!target.is(':disabled')) {
				  onMenuChange(target.attr("name"),target.attr("data"),target[0].checked);
				}
			});
		}
	
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(outer);
	};
  
  var hideMenuTimer;
  var hideSubmenuTimer;

  function toggleMenu(event){
    clearTimeout(hideMenuTimer);
    clearTimeout(hideSubmenuTimer);
    hideSubmenuTimer = null;
    if ($('.swingbox').is(':visible')){
      hideMenu();
    } else {
      showMenu();
    }
  };

  function showMenu(){
    var swingbox = $('.swingbox');
    swingbox.css('display', 'block');
    swingbox.find("ul ul:visible").css('display', 'none');
  };
  
  function hideMenu(){
    var swingbox = $('.swingbox');
    clearTimeout(hideMenuTimer);
    clearTimeout(hideSubmenuTimer);
    hideSubmenuTimer = null;
    if (swingbox.is(':visible')){
      $(swingbox).fadeOut(250);
    }
  };
  
  function mouseOverMenuItem(li){
    var swingbox = $('.swingbox');
    clearTimeout(hideMenuTimer);
    var submenu = li.children("ul");
    var otherSubmenus = swingbox.find("ul ul:visible").not(submenu);
    if (otherSubmenus.length > 0 && submenu.length == 0) {
      if (hideSubmenuTimer == null){
        hideSubmenuTimer = setTimeout(function() { otherSubmenus.fadeOut(250); }, 500);
      }
    } else if (submenu.length > 0) {
      clearTimeout(hideSubmenuTimer);
      hideSubmenuTimer = null;
      otherSubmenus.css('display', 'none');
      submenu.css('display', 'block');
    }
  };
		
  function mouseOutMenu(){
    clearTimeout(hideMenuTimer);
    hideMenuTimer = setTimeout(hideMenu, 1200);
  };
  
	function onMenuChange(groupName,data,checked){ 
	
		if(groupName == constants.MAP_TYPE)
		{
			mapType = data;
			mapTypeChangeFn(mapType);
	 
		}
		else if(groupName == constants.ALL_ASSETS)
		{
			$('ul#navmenu li input:checkbox[name='+constants.ALL_ASSETS+']').each(function(){
			   isAllAssetsSelected = $(this).is(':checked')
			});
			allAssetsChangeFn(isAllAssetsSelected);
		}
		else if(groupName == constants.LABEL_MENU || groupName == constants.DETAILS_MENU)
		{
			$('ul#navmenu li input:radio[name='+constants.LABEL_MENU+']').each(function(){
				if($(this).is(':checked'))
					labelDetailOptions[$(this).attr("id")] = true;
				else
					labelDetailOptions[$(this).attr("id")] = false;
			});
			
			$('ul#navmenu li input:checkbox[name='+constants.DETAILS_MENU+']').each(function(){
				if($(this).is(':checked'))
					labelDetailOptions[$(this).attr("id")] = true;
				else
					labelDetailOptions[$(this).attr("id")] = false;
			}); 
			
			labelDetailChangeFn(labelDetailOptions);
		} 
		else if(groupName == constants.MAP_TOOLS || groupName == constants.COORDS_MENU)
		{
			mapToolChangeFn(getSelectedMapToolMenuItems(), data);
		}
	};
	function createMenu(recreate){	  
		if(recreate){
			$('#mapInfoPanel').empty();
		}
		
		mainUL = util.createControlEle("ul","navmenu","navmenu");
		coordUL = util.createControlEle("ul","coordULMenu","sub1");
		labelUL = util.createControlEle("ul","labelULMenu","sub2");
		detailUL = util.createControlEle("ul","detailULMenu","sub1");
		swingbox.appendChild(mainUL); 
	
		if( showMaptype )
		{
			if(showNavInfoMapType)
			{
				util.createNavInfoMapType(mainUL);			
			}
			else
			{
				util.createMapTypes(mainUL,map.vlMapOptions.mapType);			
			}
		}
		
		if( showLabels )
		{
			util.addMenuItem(constants.SEPARATOR,mainUL);
			util.createLabel(mainUL,
				labelUL,
				detailUL,
				labelDetailOptions,
				map_.vlMapOptions.assetLabelPreference,
				map.vlMapOptions.meterLabelPreference);
		}
		
		if( showDetails )
		{					 
			util.createDetails(mainUL,
				labelUL,
				detailUL,
				labelDetailOptions,
				showDesign,
				map_.vlMapOptions.assetLabelPreference,
				map.vlMapOptions.meterLabelPreference);
		}
		
		if( showAllAssets)
		{
			util.addMenuItem(constants.SEPARATOR,mainUL);
			util.createAllAssets(mainUL,map.vlMapOptions.allAssetSelected);
		}
		
	
		if( showMapTools )
		{
			
			util.addMenuItem(constants.SEPARATOR,mainUL);
			util.createMapTools(mainUL,coordUL,selectedMapToolItems);
			  
		}
	
		if( showSiteFill )
		{
			util.addMenuItem(constants.SEPARATOR,mainUL);
			util.createSiteFill(mainUL,selectedMapToolItems);
		}
	};
	
	function getSelectedMapToolMenuItems(){
				$('ul#navmenu li input:radio[name='+constants.COORDS_MENU+']').each(function(){
					if($(this).is(':checked'))
					{
						selectedMapToolItems.coordsSelection = $(this).attr("data");
					}						 
				});
	
				$('ul#navmenu li input:checkbox[name='+constants.MAP_TOOLS+']').each(function(){
					var dataVal =  $(this).attr("data");
					var checkboxChecked = $(this).is(':checked');
					if(dataVal == constants.ASSETS_TOOL)
						selectedMapToolItems.isAssetsTool = checkboxChecked;
					else if(dataVal == constants.PRODUCTION_DATA_TOOL)
						selectedMapToolItems.isProductionDataTool = checkboxChecked;
					else if(dataVal == constants.CELL_DETAILS_TOOL)
						selectedMapToolItems.isCellDetailsTool = checkboxChecked;
					else if(dataVal == constants.MEASURE_TOOL)
						selectedMapToolItems.isMeasureTool = checkboxChecked;
					else if(dataVal == constants.AREA_TOOL)
						selectedMapToolItems.isAreaTool = checkboxChecked;
					else if(dataVal == constants.FILL_TOOL)
						selectedMapToolItems.isFillTool = checkboxChecked;
				});
			  return selectedMapToolItems;
	};
	
	namespace.updateToolsMenuSelection = function(toolName,active){
		$('ul#navmenu li input:checkbox[name='+constants.MAP_TOOLS+']').each(function(){
			var checkBox = $(this);
			if(checkBox.attr("data") == toolName){
				checkBox[0].checked = active;
				var label = checkBox.next('label');
				if (active) {
					label.addClass('checkBoxChecked');
				} else {
					label.removeClass('checkBoxChecked');
				}
			}
		});
	};
	
	namespace.updateMapTypeMenuSelection = function(selectedMapType){  
       $('ul#navmenu li input:radio[name='+constants.MAP_TYPE+']').each(function(){
        	var radio = $(this);
        	var isSelected = radio.attr("data") == selectedMapType;
        	radio[0].checked = isSelected;
        	if (window.attachEvent && !window.addEventListener) {
				var rLabel = radio.next('label');
				if (isSelected) {
					rLabel.addClass("checked");
				} else {
					rLabel.removeClass("checked");
				}
			}
        });
        mapType = selectedMapType;
    };
	
	namespace.updateCoordsMenuSelection = function(selectedCoords){
        $('ul#navmenu li input:radio[name='+constants.COORDS_MENU+']').each(function(){
            var radio = $(this);
            radio[0].checked = radio.attr("data") == selectedCoords;
        });
    };
    
	namespace.showToolsMenuItem = function(toolName,visible){
		$('ul#navmenu li input:checkbox[name='+constants.MAP_TOOLS+']').each(function(){
			if($(this).attr("data") == toolName){
				$(this).closest('li').css('display', visible ? 'list-item' : 'none');
			}
		});
	};
	
	namespace.enableToolsMenuItem = function(toolName,enable){
		$('ul#navmenu li input:checkbox[name='+constants.MAP_TOOLS+']').each(function(){
      var input = $(this);
			if(input.attr("data") == toolName){
				input.prop('disabled', !enable);
        if (enable){
          input.closest('li').removeClass('disabled');
        } else {
          input.prop('checked', false);
          input.closest('li').addClass('disabled');
        }
			}
		});
	};
	
	namespace.updateAllAssetMenuSelection = function(selected){	  
        $('ul#navmenu li input:checkbox[name='+constants.ALL_ASSETS+']').each(function(){           
           var checkBox = $(this);
			if(checkBox.attr("data") == constants.ALL_ASSETS){
				checkBox[0].checked = selected;
				var label = checkBox.next('label');
				if (selected) {
					label.addClass('checkBoxChecked');
				} else {
					label.removeClass('checkBoxChecked');
				}
			}
		});
	 };
	 
	namespace.resetMenu = function(){
		createMenu(true);
	 };
	 
 
} (window.VLMapInfoControl = window.VLMapInfoControl || {}, jQuery));