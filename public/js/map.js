/**
 * Created by Alessandro on 20/11/2016.
 */
require([
    "esri/views/MapView",
    "esri/WebMap",
    "esri/widgets/Locate",
    "dojo/domReady!"
], function(MapView, WebMap, Locate){

    /************************************************************
     * Creates a new WebMap instance. A WebMap must reference
     * a PortalItem ID that represents a WebMap saved to
     * arcgis.com or an on-premise portal.
     *
     * To load a WebMap from an on-premise portal, set the portal
     * url in esriConfig.portalUrl.
     ************************************************************/

    var webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
            id: "f2e9b762544945f390ca4ac3671cfa72"
        }
    });

    /************************************************************
     * Set the WebMap instance to the map property in a MapView.
     ************************************************************/
    var view = new MapView({
        map: webmap,
        container: "viewDiv",
        zoom: 6,  // Sets the zoom level based on level of detail (LOD)
        center: [-1, 53]  // Sets the center point of view in lon/lat
    });

    var map = new Map({
        basemap: "streets"
    });


    var locateBtn = new Locate({
        view: view
    });
    locateBtn.startup();

    // Add the locate widget to the top left corner of the view
    view.ui.add(locateBtn, {
        position: "top-left",
        index: 0
    });

});