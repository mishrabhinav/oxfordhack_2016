/**
 * Created by Alessandro on 19/11/2016.
 */
angular
    .module('app', [])
    .controller('appCtrl', ['$scope', '$http', '$window', function appCtrl($scope, $http, $window) {
        var albumName;
        var partialData = [];
        var imgData = [];
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

        $scope.pushData = function() {
            console.log("In here");
            URL = "/" + getFacebookAlbum(document.getElementById("url").value) + "/";
            address = document.getElementById("pos").value;

            var addressToQuery = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?Address="
                                    + address + "&City=" + getLastWord(address) + "&Country=UK&outFields=type,city,country&f=pjson";

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
                        URL + 'photos?fields=link,name,images,event,album,place',
                        function(response) {
                            if (response && !response.error) {
                                albumName = response.data[0].album.name;
                                console.log(response);
                                response.data.forEach(function(element){
                                    partialData.push(element.images[0].source);
                                });
                                imgData = [albumName, partialData];
                                console.log(imgData);

                                var postConfig = {headers : {'Content-Type': 'application/json'}};
                                console.log(imgData);
                                $http.post('/', imgData, postConfig)
                                    .then(function(resp) {
                                        console.log(resp)
                                    });
                                partialData = [];
                            } else {
                                console.log("nothing");
                            }
                        }
                    );
                }

            });

            console.log("In here2");

        };

        function getFacebookAlbum(str) {
            var n = str.split("&album_id=");
            return n[n.length - 1];
        }

        function getLastWord(str) {
            var n = str.split(" ");
            return n[n.length - 1];
        }

    }]);
