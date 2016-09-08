'use strict';

window.vlmap = window.vlmap || {};
vlmap.controls = vlmap.controls || {};
(function (InfoWindowHTML, undefined) {
    InfoWindowHTML.InfoWindowContent = function () {

    };

    InfoWindowHTML.InfoWindowContent.prototype = function () {

        var getInfoWindowHTML = function (detail, checkBoxStatusObject) {
            var isLogoHeader;
            var imgPathForLogo;
            var themeColor;
            if (detail.makeModel != null && detail.makeModel != "") {
                var make = detail.makeModel.toUpperCase();
                var params = make.split(" ", 2);
                if (params[0].toString() == "CAT") {

                    imgPathForLogo = '../src/images/icon-cat_logo-infowindow.png';
                }
                else if ((make.indexOf("CAT", 0) == 0) || (make.search("CAT") == 0)) {
                    imgPathForLogo = '../src/images/icon-cat_logo-infowindow.png';
                }
                else if ((make.indexOf("TATA HITACHI", 0) == 0) || (make.search("TATA HITACHI") == 0)) {
                    imgPathForLogo = '../src/images/tata_hitach.png';
                    isLogoHeader = true;
                }
                else if ((params[0].toString() == "LEEBOY") || (make.indexOf("LEEBOY", 0) == 0) || (make.search("LEEBOY") == 0)) {
                    imgPathForLogo = '../src/images/leeboy_windowinfo.png';
                    isLogoHeader = true;
                }
                else if (params[0].toString() == "VER") {
                    imgPathForLogo = '../src/images/Vermeer_logo_large.png';
                }
                else if ((make.indexOf("VER", 0) == 0)) {
                    imgPathForLogo = '../src/images/Vermeer_logo_large.png';
                }
                else if ((make.indexOf("NEW HOLLAND", 0) == 0) || params[0].toString() == "NEW" || (make.search("NEW HOLLAND") == 0)) {
                    imgPathForLogo = '../src/images/NH_logo.png';
                    isLogoHeader = true;
                }
                else if ((make.indexOf("CASE", 0) == 0) || params[0].toString() == "CASE" || (make.search("CASE") == 0)) {
                    imgPathForLogo = '../src/images/CASE_logo.png';
                    isLogoHeader = true;
                }
                else if ((make.indexOf("DOOSAN", 0) == 0) || params[0].toString() == "DOOSAN" || (make.search("DOOSAN") == 0)) {
                    imgPathForLogo = '../src/images/Doosan_logo.png';
                    isLogoHeader = true;
                }
            }
            else {
                imgPathForLogo = "";
            }

            //Creating the logo header if the images exist

            var contentDiv = document.createElement('div');
            contentDiv.setAttribute('class', 'infowindowContainer')
            //Future Reference
            /*  if (isLogoHeader == true) {
                  contentDiv.setAttribute('class', 'infowindowContainerWithLogo');
                  var logoCntent = document.createElement('div');
                  logoCntent.setAttribute('class', 'infoWindowContentLogoHeader');
                  contentDiv.appendChild(logoCntent);
                  //logoCntent.style.backgroundImage = 'url(' + imgPathForLogo + ')';
                  if (themeColor) {
                      logoCntent.style.backgroundColor = '#FFFFFF';
                  }
                  else
                      logoCntent.style.backgroundColor = '#FFFFFF';
              }*/

            var assetImageContent = document.createElement('div');
            //For hiding the border when infowindow doesn not represent any data
            if (checkBoxStatusObject.vin || checkBoxStatusObject.make || checkBoxStatusObject.loc || checkBoxStatusObject.status || checkBoxStatusObject.fuel || checkBoxStatusObject.hrs) {
                assetImageContent.setAttribute('class', 'borderBottom infoWindowAssetNameContainer');
            } else {
                assetImageContent.setAttribute('class', 'infoWindowAssetNameContainer');
            }
            var assetImageContentDataTable = document.createElement('table');
            assetImageContentDataTable.style.width = '345px';
            assetImageContentDataTable.style.border = '0px';
            assetImageContentDataTable.setAttribute('cellspacing', '3');
            assetImageContentDataTable.setAttribute('cellpadding', '0');

            var tableRow = document.createElement('tr');
            tableRow.setAttribute('class', 'infoWindowContentLogoHeader')

            if (imgPathForLogo != "" && imgPathForLogo != null) {
                var logoTableData = document.createElement('td');
                logoTableData.style.align = 'left';
                var logoImage = document.createElement('img');
                logoImage.setAttribute('src', imgPathForLogo);
                logoTableData.appendChild(logoImage);
                if (isLogoHeader) {
                    //logoTableData.style.backgroundColor = '#2828C8';
                }
                // logoTableData.style.backgroundImage = 'url(' + imgPathForLogo + ')';
                tableRow.appendChild(logoTableData);
            }

            var iconTableData = document.createElement('td');
            iconTableData.style.align = 'left';
            var logoImage = document.createElement('img');
            logoImage.setAttribute('src', '../src/images/AssetIcons/3512.png');
            //iconTableData.appendChild('<img src="data:image/jpeg;base64,' + getAssetIcon(waypointData.assetIconID) + '"/>');
            iconTableData.appendChild(logoImage);

            var assetNameTableData = document.createElement('td');
            var assetNameTableDataDiv = document.createElement('span');
            assetNameTableDataDiv.setAttribute('class', 'clickableDiv');
            assetNameTableData.appendChild(assetNameTableDataDiv);
            assetNameTableDataDiv.style.align = 'left';

            if (themeColor) {
                assetNameTableDataDiv.style.color = '#F0F0F0';
            }
            else
                assetNameTableDataDiv.style.color = '#050c51';

            var makemodel = document.createTextNode(detail.makeModel);
            assetNameTableDataDiv.appendChild(makemodel);
            /*assetNameTableDataDiv.click(function(){
                openAssetDetailsFromMap(waypointData.assetID, "DASHBOARD");
                         });*/

            tableRow.appendChild(iconTableData);
            tableRow.appendChild(assetNameTableData);

            assetImageContentDataTable.appendChild(tableRow)
            assetImageContent.appendChild(assetImageContentDataTable);
            
            //Creating bottom container for the infowindow

            var dataContentDiv = document.createElement('div');
            dataContentDiv.setAttribute('class', 'infowindowBottomContainer');

            var dataContentDivTable = document.createElement('table');
            dataContentDivTable.style.border = '0px';
            dataContentDivTable.setAttribute('id', 'windowContent');
            dataContentDivTable.setAttribute('cellspacing', '3');
            dataContentDivTable.setAttribute('cellpadding', '0');

            var dataContentVINrow = document.createElement('tr');
            var dataContentHoursrow = document.createElement('tr');
            var dataContentModelrow = document.createElement('tr');
            var dataContentLastReportedrow = document.createElement('tr');
            var dataContentStatusrow = document.createElement('tr');
            var dataContentFuelrow = document.createElement('tr');
            var dataContentLocationrow = document.createElement('tr');

            //VIN Number
            var dataContentVINTextTd = document.createElement('td');
            dataContentVINTextTd.setAttribute('class', 'bottomContainerText');
            var dataContentVINValueTd = document.createElement('td');
            dataContentVINValueTd.setAttribute('class', 'bottomContainerValue');

            var vinText = document.createTextNode('VIN :');
            dataContentVINTextTd.appendChild(vinText);
            dataContentVINrow.appendChild(dataContentVINTextTd);
            dataContentVINrow.setAttribute('id', 'vinId');
            if (detail.equipmentVIN) {
                var vinValue = document.createTextNode(detail.equipmentVIN);
            } else {
                var vinValue = document.createTextNode('-');
            }
 
            dataContentVINValueTd.appendChild(vinValue);
            dataContentVINrow.appendChild(dataContentVINValueTd);
            if (checkBoxStatusObject.vin) {
                dataContentDivTable.appendChild(dataContentVINrow);
            } else { }

            //Fuel
            var dataContentFuelTextTd = document.createElement('td');
            dataContentFuelTextTd.setAttribute('class', 'bottomContainerText');
            var dataContentFuelValueTd = document.createElement('td');
            dataContentFuelValueTd.setAttribute('class', 'bottomContainerValue');

            var fuelText = document.createTextNode('Fuel ( %Remaining) :');
            dataContentFuelTextTd.appendChild(fuelText);
            dataContentFuelrow.appendChild(dataContentFuelTextTd);
            if (detail.fuelPercentRemaining) {
                var fuelValue = document.createTextNode(detail.fuelPercentRemaining);
            } else {
                var fuelValue = document.createTextNode('-');
            }

            dataContentFuelValueTd.appendChild(fuelValue);
            dataContentFuelrow.appendChild(dataContentFuelValueTd);
            if (checkBoxStatusObject.fuel) {
                dataContentDivTable.appendChild(dataContentFuelrow);
            }
            //Location
            var dataContentLocationTextTd = document.createElement('td');
            dataContentLocationTextTd.setAttribute('class', 'bottomContainerText');
            var dataContentLocationValueTd = document.createElement('td');
            dataContentLocationValueTd.setAttribute('class', 'bottomContainerValue');

            var locText = document.createTextNode('Location :');
            dataContentLocationTextTd.appendChild(locText);
            dataContentLocationrow.appendChild(dataContentLocationTextTd);
            if (detail.location) {
                var locValue = document.createTextNode(detail.location);
            } else {
                var locValue = document.createTextNode('-');
            }

            dataContentLocationValueTd.appendChild(locValue);
            dataContentLocationrow.appendChild(dataContentLocationValueTd);
            if (checkBoxStatusObject.loc) {
                dataContentDivTable.appendChild(dataContentLocationrow);
            }
            //Hours 
            var dataContentHoursTextTd = document.createElement('td');
            dataContentHoursTextTd.setAttribute('class', 'bottomContainerText');
            var dataContentHoursValueTd = document.createElement('td');
            dataContentHoursValueTd.setAttribute('class', 'bottomContainerValue');

            var hrText = document.createTextNode('Hours :');
            dataContentHoursTextTd.appendChild(hrText);
            dataContentHoursrow.appendChild(dataContentHoursTextTd);
            if (detail.runtimeHours) {
                var locValue = document.createTextNode(detail.runtimeHours);
            } else {
                var locValue = document.createTextNode('-');
            }

            dataContentHoursValueTd.appendChild(locValue);
            dataContentHoursrow.appendChild(dataContentHoursValueTd);
            if (checkBoxStatusObject.hrs) {
                dataContentDivTable.appendChild(dataContentHoursrow);
            }

            //Make/Model
            var dataContentModelTextTd = document.createElement('td');
            dataContentModelTextTd.setAttribute('class', 'bottomContainerText');
            var dataContentModelValueTd = document.createElement('td');
            dataContentModelValueTd.setAttribute('class', 'bottomContainerValue');

            var hrText = document.createTextNode('Make/Model :');
            dataContentModelTextTd.appendChild(hrText);
            dataContentModelrow.appendChild(dataContentModelTextTd);
            if (detail.makeModel) {
                var makeValue = document.createTextNode(detail.makeModel);
            } else {
                var makeValue = document.createTextNode('-');
            }

            dataContentModelValueTd.appendChild(makeValue);
            dataContentModelrow.appendChild(dataContentModelValueTd);
            if (checkBoxStatusObject.make) {
                dataContentDivTable.appendChild(dataContentModelrow);
            }
            //Last Reported
            var dataContentLastReportTextTd = document.createElement('td');
            dataContentLastReportTextTd.setAttribute('class', 'bottomContainerText');
            var dataContentLastReportValueTd = document.createElement('td');
            dataContentLastReportValueTd.setAttribute('class', 'bottomContainerValue');

            var hrText = document.createTextNode('Last Known Status :');
            dataContentLastReportTextTd.appendChild(hrText);
            dataContentLastReportedrow.appendChild(dataContentLastReportTextTd);
            if (detail.lastReportUTC) {
                var reportValue = document.createTextNode(detail.lastReportUTC);
            } else {
                var reportValue = document.createTextNode('-');
            }

            dataContentLastReportValueTd.appendChild(reportValue);
            dataContentLastReportedrow.appendChild(dataContentLastReportValueTd);
            if (checkBoxStatusObject.status) {
                dataContentDivTable.appendChild(dataContentLastReportedrow);
            }

            assetImageContent.appendChild(assetImageContentDataTable);
            contentDiv.appendChild(assetImageContent);
            dataContentDiv.appendChild(dataContentDivTable);
            contentDiv.appendChild(dataContentDiv);
            var contentHtmlDiv = document.createElement('div');
            contentHtmlDiv.appendChild(contentDiv);
            return contentHtmlDiv.outerHTML;
        }
        return {
            getInfoWindowHTML: getInfoWindowHTML
        };
    } ();
})(vlmap.controls);