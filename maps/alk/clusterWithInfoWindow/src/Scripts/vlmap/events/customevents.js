$(document).ready(function () {
   
    $('.olControlMousePosition').hide();

    //creating default markers
    $('#defaultMarker').click(function () {
        // debugger
        var defaultMarkerClass = new vlmap.controllers.VLMarker(map);
        defaultMarkerClass.createMarker(new ALKMaps.LonLat(-84.5, 40.5).transform(new ALKMaps.Projection("EPSG:4326"), map.getProjectionObject()),
                                        EnumMarkerTypes.getMarkerImage(EnumMarkerTypes.DEFAULT_MARKER),
                                        "someDummyText",
                                        map,
                                        true);

    });

    //radio buttons events
    $('#labeloptionv,#labeloptionf,#labeloptionl').click(function () {
        switch (this.value) {
            case "0":
                radioButtonStatusObject.vin = true;
                radioButtonStatusObject.make = false;
                radioButtonStatusObject.hrs = false;
                radioButtonStatusObject.status = false;
                radioButtonStatusObject.loc = false;
                radioButtonStatusObject.fuel = false;                
                break;
            case "1":
                radioButtonStatusObject.vin = false;
                radioButtonStatusObject.make = true;
                radioButtonStatusObject.hrs = false;
                radioButtonStatusObject.status = false;
                radioButtonStatusObject.loc = false;
                radioButtonStatusObject.fuel = false;
                break;
            case "2":
                radioButtonStatusObject.vin = false;
                radioButtonStatusObject.make = false;
                radioButtonStatusObject.hrs = true;
                radioButtonStatusObject.status = false;
                radioButtonStatusObject.loc = false;
                radioButtonStatusObject.fuel = false;
                break;
            case "3":
                radioButtonStatusObject.vin = false;
                radioButtonStatusObject.make = false;
                radioButtonStatusObject.hrs = false;
                radioButtonStatusObject.status = true;
                radioButtonStatusObject.loc = false;
                radioButtonStatusObject.fuel = false;
                break;
            case "4":
                radioButtonStatusObject.vin = false;
                radioButtonStatusObject.make = false;
                radioButtonStatusObject.hrs = false;
                radioButtonStatusObject.status = false;
                radioButtonStatusObject.loc = true;
                radioButtonStatusObject.fuel = false;
                break;
            case "5":
                radioButtonStatusObject.vin = false;
                radioButtonStatusObject.make = false;
                radioButtonStatusObject.hrs = false;
                radioButtonStatusObject.status = false;
                radioButtonStatusObject.loc = false;
                radioButtonStatusObject.fuel = true;
                break;

            default:
                break;
        }

        //triggering custom event
        $(radioButtonInfo).trigger(radioButtonEventsType.RADIO_BUTTON_CHANGE_EVENT.type, radioButtonStatusObject);
    });


    //listening Event
    $(radioButtonInfo).bind(radioButtonEventsType.RADIO_BUTTON_CHANGE_EVENT.type, customName)
    $(customMarkerEvent).bind(customMarkerEvent.CUSTOM_MARKER_CLICK_EVENT.type, openInfoWindow);

});

//Event method1
function customName(evt, radioButtonStatusObject) {
    markerdata.removeMarkers();
    markerdata.createCustomMarkers(validAssets, radioButtonStatusObject);
}
