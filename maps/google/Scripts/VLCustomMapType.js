function CustomMapType(stdMapType) {

//Standard or base map types are just objects.
//e.g. var roadmap=map.mapTypes.get(google.maps.MapTypeId.ROADMAP);
//console.log(roadmap.constructor.name);//=> Qu
//console.log(typeof roadmap);//=> object

//All we want to change is the maxZoom so expose everything else from
//the base map type to make them accessible

    for (var p in stdMapType) {
        if (stdMapType.hasOwnProperty(p)) {
            this[p] = stdMapType[p];
        }
    }       
    this.maxZoom = constants.MAX_ZOOM;
}

CustomMapType.prototype = new Object();//cannot use Object.create as not supported by IE8
CustomMapType.prototype.constructor = CustomMapType;
