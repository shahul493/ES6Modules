// Different type of Markers

var EnumMarkerTypes = {
    DEFAULT_MARKER: 0,
    FAULT_CODES_HIGH_MARKER: 1,
    FAULT_CODES_HIGH_SELECTED_MARKER: 2,
    FAULT_CODES_LOW: 3,
    FAULT_CODES_LOW_SELECTED: 4,
    FAULT_CODE_MEDIUM: 5,
    FAULT_CODE_MEDIUM_SELECTED: 6,
    HOURS_LOCATION_DEFAULT: 7,
    HOURS_LOCATION_STARTING: 8,
    HOURS_LOCATION_ENDING: 9,
    HOURS_LOCATION_SELECTED: 10,
    HOURS_LOCATION_DEFAULT_ARROWS: 11,
    HOURS_LOCATION_STARTING_ARROWS: 12,
    HOURS_LOCATION_ENDING_ARROWS: 13,
    HOURS_LOCATION_SELECTED_ARROW: 14,
    MANUAL_MAINTENANCE_MARKER: 15,
    HOURS_LOCATION_ARROWS: 16,
    getMarkerImage: function (MarkerTypeId) {
        var imagePath;
        switch (MarkerTypeId) {

            case 0:
                imagePath = '../src/images/zoneBalloon.png';
                break;
            case 1:
                imagePath = '../src/images/faultBalloonHigh.png';
                break;
            case 2:
                imagePath = '../src/images/faultBalloonHighSelected.png';
                break;
            case 3:
                imagePath = '../src/images/faultBalloonLow.png';
                break;
            case 4:
                imagePath = '../src/images/faultBalloonLowSelected.png';
                break;
            case 5:
                imagePath = '../src/images/faultBalloonMed.png';
                break;
            case 6:
                imagePath = '../src/images/faultBalloonMedSelected.png';
                break;
            case 7:
                imagePath = '../src/images/bullet_ball_blue.png';
                break;
            case 8:
                imagePath = '../src/images/bullet_ball_green.png';
                break;
            case 9:
                imagePath = '../src/images/bullet_ball_red.png';
                break;
            case 10:
                imagePath = '../src/images/bullet_ball_yellow.png';
                break;
            case 11:
                imagePath = '../src/images/blue.png';
                break;
            case 12:
                imagePath = '../src/images/green.png';
                break;
            case 13:
                imagePath = '../src/images/red.png';
                break;
            case 14:
                imagePath = '../src/images/yellow.png';
                break;
            case 15:
                imagePath = '../src/images/map_marker_icon.png';
                break;
            case 16:
                imagePath = '../src/images/arrows.png';
                break;
            default:
                imagePath = '../src/images/zoneBalloon.png';
        }
        return imagePath;
    }

};


