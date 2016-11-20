/**
 * Created by Alessandro on 19/11/2016.
 */
angular
  .module('app', [])
  .controller('appCtrl', ['$scope', '$http', '$window', function appCtrl($scope, $http, $window) {
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
          FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                  console.log('Logged in.');
                  FB.api(
                          '/1283053661745309/photos?fields=link,name,images',
                          function(response) {
                              if (response && !response.error) {
                                  response.data.forEach(function(element){
                                      imgData.push({src: element.images[0].source, id: element.id});
                                  });
                              } else {
                                  console.log("nothing");
                              }
                          }
                  );
              }
              else {
                  console.log("not logged in");
                  FB.login();
              }
          });
      };

      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      var URL;
      var pos;

      function getURL(){
          URL = document.getElementById("url").value;
          pos = document.getElementById("pos").value;
          console.log(URL);
          console.log(pos);

      }

        $scope.pushData = function() {
          var postConfig = {headers : {'Content-Type': 'application/json'}}

          $http.post('/', imgData, postConfig)
            .then(function(resp) {
              console.log(resp)
            })
        };
      }])
