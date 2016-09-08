var InfoWindowLablesSelectionEvent = {};
var InfoWindowLablesSelectionEventType = {
        INFO_WINDOW_LABELS_SELECTION_CHANGE_EVENT: {
                                type: "infoWindowLabelsSelectionChangeEvent",
                                message:"customMessage"
                           }

    };

var infoWindowLabelsObject = {
    "vin": true,
    "make": true,
    "hrs": true,
    "status": true,
    "loc":true,
    "fuel": true
};




//Radio Button event for custom marker

var vlMarkerLabelSelectionEvent = {};
var vlMarkerLabelSelectionEventType = {
    VL_MARKER_LABEL_SELECTION_EVENT: {
        type: "vlMarkerLabelSelectionEvent",
        message: "customMessage"
    }

};

var customMarkerLabelOptions = {
    "vin": true,
    "make": false,
    "hrs": false,
    "status": false,
    "loc": false,
    "fuel": false
};

