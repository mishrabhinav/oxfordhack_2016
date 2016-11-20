/**
 * Created by Alessandro on 20/11/2016.
 */
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/geometry/Circle",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Graphic",
    "esri/PopupTemplate",
    "dojo/domReady!"
], function(
    Map,
    MapView,
    Polyline,
    Circle,
    Point,
    SimpleMarkerSymbol,
    Graphic,
    PopupTemplate
) {

    var map = new Map({
        basemap: "streets"
    });

    var view = new MapView({
        center: [-1, 53],
        container: "viewDiv",
        map: map,
        zoom: 6
    });

    // First create a line geometry (this is the Keystone pipeline)


    var point = new Point({
            latitude: 55.3,
            longitude: 1.5
        });

    var markerSymbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],
        outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
        }
    });
    /*
    // Create a symbol for drawing the line
    var lineSymbol = new SimpleLineSymbol({
        color: [226, 119, 40],
        width: 4
    });
*/
    // Create an object for storing attributes related to the line
    var pointAtt = {
        Name: "Keystone Pipeline",
        Owner: "TransCanada",
        Length: "3,456 km"
    };

    /*******************************************
     * Create a new graphic and add the geometry,
     * symbol, and attributes to it. You may also
     * add a simple PopupTemplate to the graphic.
     * This allows users to view the graphic's
     * attributes when it is clicked.
     ******************************************/

    var pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: pointAtt,

        popupTemplate: {
            title: "{Name}",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "Name"
                }, {
                    fieldName: "Owner"
                }, {
                    fieldName: "Length"
                }]
            }]
        }
    });


    // Add the line graphic to the view's GraphicsLayer
    view.graphics.add(pointGraphic);
});