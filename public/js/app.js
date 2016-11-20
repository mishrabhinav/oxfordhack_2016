/**
 * Created by Alessandro on 19/11/2016.
 */
angular
    .module('app', [])
    .controller('appCtrl', ['$scope', '$http', '$window', function appCtrl($scope, $http, $window) {
        var albumName;
        var imgData = [];
        var newPoint;
        var newGraphic;


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

            function createPoint(x, y) {
                return new Point({
                    latitude: y,
                    longitude: x
                });
            }

            function setGraphic(point, attributes) {
                return new Graphic({
                    geometry: point,
                    symbol: markerSymbol,
                    attributes: attributes,
                    popupTemplate: {
                        title: attributes
                    }
                })
            }

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

            function addNewPoint(pointGraphic) {
                // Add the line graphic to the view's GraphicsLayer
                view.graphics.add(pointGraphic);
            }

            $window.fbAsyncInit = function() {
                FB.init({
                    appId: '1151594398249523',
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.4'
                });

                FB.AppEvents.logPageView();
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            var URL;
            var address;
            $scope.pjson = {};
            $scope.emotions = [];
            $scope.pushData = function() {
                console.log("In here");
                URL = "/" + getFacebookAlbum(document.getElementById("url").value) + "/";
                address = document.getElementById("pos").value;

                var addressToQuery = "http://geocode.arcgis.com/arcgis/rest/services/" +
                    "World/GeocodeServer/findAddressCandidates?Address="
                    + address + "&City=" + getLastWord(address) + "&Country=UK&outFields=type,city,country&f=pjson";

                $scope.getPJSON(addressToQuery)
                console.log(URL);
                console.log(getLastWord(address));

                FB.getLoginStatus(function(response) {
                    while (response.status !== 'connected') {
                        console.log("not logged in");
                        FB.login();
                    }
                    if (response.status === 'connected') {
                        console.log('Logged in.');
                        FB.api(
                            URL + 'photos?fields=link,id,name,images,event,album,place',
                            function(response) {
                                if (response && !response.error) {
                                    albumName = response.data[0].album.name;
                                    console.log(response);
                                    response.data.forEach(function(element){
                                        imgData.push({src: element.images[0].source,
                                          id: element.id});
                                    });
                                    var postConfig = {headers : {'Content-Type': 'application/json'}};
                                    console.log(imgData);
                                    $http.post('/', imgData, postConfig)
                                        .then(function(response) {
                                          $scope.emotions = response.data;
					  console.log(response.data)
                                        });
                                    imgData = [];
                                    var x = $scope.pjson.candidates[0].location.x;
                                    var y = $scope.pjson.candidates[0].location.y;
                                    newPoint = createPoint(x, y);
                                    newGraphic = setGraphic(newPoint, albumName);
                                    addNewPoint(newGraphic)
                                } else {
                                    console.log("nothing");
                                }
                            }
                        );
                    }
                });
            };

            $scope.getPJSON = function(addressToQuery) {
                $http.get(addressToQuery)
                    .then(function(response) {
                        $scope.pjson = response.data;
                        console.log($scope.pjson);
                    })
            };

            function getFacebookAlbum(str) {
                var n = str.split("&album_id=");
                return n[n.length - 1];
            }

            function getLastWord(str) {
                var n = str.split(" ");
                return n[n.length - 1];
            }

        });

    }]);
