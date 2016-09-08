$(document).ready(function () {
    var selAsset;
    var popup;
    var infoWindow;
    $('#vin,#fuel,#mke,#loc,#st,#hrs').click(function () {
        //debugger
        switch (this.id) {
            case "vin":
                if (this.checked)
                    infoWindowLabelsObject.vin = true;
                else
                    infoWindowLabelsObject.vin = false;
                break;
            case "fuel":
                if (this.checked)
                    infoWindowLabelsObject.fuel = true;
                else
                    infoWindowLabelsObject.fuel = false;
                break;
            case "mke":
                if (this.checked)
                    infoWindowLabelsObject.make = true;
                else
                    infoWindowLabelsObject.make = false;
                break;
            case "loc":
                if (this.checked)
                    infoWindowLabelsObject.loc = true;
                else
                    infoWindowLabelsObject.loc = false;
                break;
            case "st":
                if (this.checked)
                    infoWindowLabelsObject.status = true;
                else
                    infoWindowLabelsObject.status = false;
                break;
            case "hrs":
                if (this.checked)
                    infoWindowLabelsObject.hrs = true;
                else
                    infoWindowLabelsObject.hrs = false;
                break;
            default:
                break;
        }
        $(InfoWindowLablesSelectionEvent).trigger(InfoWindowLablesSelectionEventType.INFO_WINDOW_LABELS_SELECTION_CHANGE_EVENT.type, infoWindowLabelsObject);
    });

    $('#Radio,#Radio1,#Radio2,#Radio3,#Radio4,Radio5').click(function () {
        switch (this.value) {
            case "0":
                customMarkerLabelOptions.vin = true;
                customMarkerLabelOptions.make = false;
                customMarkerLabelOptions.hrs = false;
                customMarkerLabelOptions.status = false;
                customMarkerLabelOptions.loc = false;
                customMarkerLabelOptions.fuel = false;
                break;
            case "1":
                customMarkerLabelOptions.vin = false;
                customMarkerLabelOptions.make = true;
                customMarkerLabelOptions.hrs = false;
                customMarkerLabelOptions.status = false;
                customMarkerLabelOptions.loc = false;
                customMarkerLabelOptions.fuel = false;
                break;
            case "2":
                customMarkerLabelOptions.vin = false;
                customMarkerLabelOptions.make = false;
                customMarkerLabelOptions.hrs = true;
                customMarkerLabelOptions.status = false;
                customMarkerLabelOptions.loc = false;
                customMarkerLabelOptions.fuel = false;
                break;
            case "3":
                customMarkerLabelOptions.vin = false;
                customMarkerLabelOptions.make = false;
                customMarkerLabelOptions.hrs = false;
                customMarkerLabelOptions.status = true;
                customMarkerLabelOptions.loc = false;
                customMarkerLabelOptions.fuel = false;
                break;
            case "4":
                customMarkerLabelOptions.vin = false;
                customMarkerLabelOptions.make = false;
                customMarkerLabelOptions.hrs = false;
                customMarkerLabelOptions.status = false;
                customMarkerLabelOptions.loc = true;
                customMarkerLabelOptions.fuel = false;
                break;
            case "5":
                customMarkerLabelOptions.vin = false;
                customMarkerLabelOptions.make = false;
                customMarkerLabelOptions.hrs = false;
                customMarkerLabelOptions.status = false;
                customMarkerLabelOptions.loc = false;
                customMarkerLabelOptions.fuel = true;
                break;

            default:
                break;
        }

        //triggering custom event
        $(vlMarkerLabelSelectionEvent).trigger(vlMarkerLabelSelectionEventType.VL_MARKER_LABEL_SELECTION_EVENT.type, customMarkerLabelOptions);
    });

    

});


