//Object for custom event
var customMarkerEvents = {};

//custom event Type (kind of json class which will be used the event type while triggering and listening)
var customMarkerEvent = {
    CUSTOM_MARKER_CLICK_EVENT: {
        type: "customMarkerClickEvent",
        message: "customMessage"
    }

};

//custom Data need to pass along with the custom event type
var customMarkerAsset = {
    "asset": null
};