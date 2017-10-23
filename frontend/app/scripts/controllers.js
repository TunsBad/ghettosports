'use strict';

angular.module('ghettoSports')

.controller('HomeController', ['$scope', 'gossipsFactory', '$http', 'topstoriesFactory', 'ghstoriesFactory', 'headlinesFactory', function ($scope, gossipsFactory, $http, topstoriesFactory, ghstoriesFactory, headlinesFactory) {

	$scope.showGossips = false;
    $scope.showTop = false;
    $scope.showHline = false;
	$scope.message = "Loading ....";
    $scope.messageTop = "Loading ....";
    $scope.messageGh = "Loading ....";
    $scope.messageHline = "Loading ....";
    $scope.messageSR = "Loading ....";
    $scope.showGh = false;
    $scope.showSR = false;
    $scope.searchText = {};

    var currentHeadline = {};

    headlinesFactory.query(
        function(response) {
            currentHeadline = response.pop();
            $scope.currentHeadline = currentHeadline;
            $scope.HeadlineTimeDiffHrs = Math.floor(currentHeadline.TimeDifference/(60 * 60 * 1000));
            $scope.showHline = true;
        },
        function(error) {
            $scope.messageHline = "Error : " + error.status + " " + error.statusText; 
        }
    );

	gossipsFactory.query(
        function(response) {
            $scope.gossips = response;
            $scope.showGossips = true;
        },
        function (error) {
            $scope.message = "Error : " + error.status + " " + error.statusText; 
        }
	);

    topstoriesFactory.query(
        function(response) {
            $scope.topstories = response;
            $scope.showTop = true;
        },
        function(error) {
            $scope.messageTop = "Error : " + error.status + " " + error.statusText;
        }
    );

    ghstoriesFactory.query(
        function(response) {
            $scope.ghstories = response;
            $scope.showGh = true;
        },
        function(error) {
            $scope.messageGh = "Error : " + error.status + " " + error.statusText;
        }
    );

	$scope.update = function(query) {        
        $scope.searchText.querystring = query;
		$http.get('https://ghettosports.herokuapp.com/gossips/search/' + $scope.searchText.querystring)
		    .then(function(response) {
		    	    $scope.results = response.data;
                    if (response.data.length === 0) {
                        $scope.showSR = false;
                    } else {
                        $scope.showSR = true
                    };
		          }, function(error) {
                        $scope.messageSR = "Error : " + error.status + " " + error.statusText;
            }); //setting success callbacks ....
	};

	setTimeout(function () {
        $scope.$emit('HomeController');
    }, 0); //$emit value on $scope

}])
.controller('NewsController', ['$scope', '$http', function ($scope, $http) {

    $scope.showSPB = false;
    $scope.showFFT = false;
    $scope.showBBC = false;
    $scope.showFIT = false;

    $scope.messageSPB = "Loading ....";
    $scope.messageFFT = "Loading ...."
    $scope.messageFIT = "Loading ...." 
    $scope.messageBBC = "Loading ...."

    $http.get('https://newsapi.org/v1/articles?source=four-four-two&sortBy=top&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
        .then(function(response) { 
                $scope.fourfourtwo = response.data;
                $scope.showFFT = true;
            }, function(error) {
                $scope.messageFFT = "Error: " + error.status + " " + error.statusText;
            }
        );

	$http.get('https://newsapi.org/v1/articles?source=bbc-sport&sortBy=top&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
	    .then(function(response) { 
                $scope.bbcsport = response.data;
                $scope.showBBC = true;
	        }, function(error) {
	    	    $scope.messageBBC = "Error: " + error.status + " " + error.statusText;
	       }
        );

    $http.get('https://newsapi.org/v1/articles?source=the-sport-bible&sortBy=latest&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
        .then(function(response) { 
                $scope.thesportbible = response.data;
                $scope.showSPB = true;
              }, function(error) {
                $scope.messageSPB = "Error: " + error.status + " " + error.statusText;
              }
        );

    $http.get('https://newsapi.org/v1/articles?source=football-italia&sortBy=top&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
        .then(function(response) { 
                $scope.footballitalia = response.data;
                $scope.showFIT = true;
            }, function(error) {
                $scope.messageFIT = "Error: " + error.status + " " + error.statusText;
           }
        );

    setTimeout(function () {
        $scope.$emit('NewsController');
    }, 0); //check the $emit value on $scope
    
}])
.controller('AboutController', ['$scope', 'usersFactory', function ($scope, usersFactory) {

	$scope.leaders = usersFactory.query();

	setTimeout(function () {
        $scope.$emit('AboutController');
    }, 0); //check the $emit value on $scope

}])
.controller('ContactController', ['$scope', 'enquiriesFactory', 'ngDialog', function ($scope, enquiriesFactory, ngDialog) {

    var mymap = L.map('mapid').setView([5.52, -0.48], 10);

    var marker = L.marker([5.52, -0.48]).addTo(mymap);

    marker.bindPopup("<b>Welcome !</b>");

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>', maxZoom: 18, id: 'mapbox.streets', accessToken: 'pk.eyJ1IjoidHVuZGViYWRtdXMiLCJhIjoiY2o5MDE0ODByMjdoNzMzcXVzYmppNDE0MCJ9.dxoVquDF9o3pPS1qtyrq_A'
    }).addTo(mymap);

    $scope.feedback = {
        name: "",
        phone: "",
        subject: "",
        comment: "",
        email: ""
    };
    
    //Send Button ....
    $scope.send = function () {
        enquiriesFactory.save($scope.feedback, function(response) {   
                //success dialog box configuration.        
                ngDialog.openConfirm({ template: 'views/enquirysuccess.html', className: 'ngdialog-theme-default', scope: $scope });             
                //ensure that all opened dialog boxes are closed. 
                ngDialog.close(); 
                //setting values back to defaults.
                $scope.feedback = { name: "", phone: "", subject: "", comment: "", email: "" };
                //clean feedbackForm.
                $scope.feedbackForm.$setPristine();
            }, 
            function(error) {
                //log error to console.
                console.log("Error: " + error.status + " " + error.statusText);
                ////failure dialog box config.
        	    ngDialog.open({ template: 'views/enquiryfailed.html', className: 'ngdialog-theme-default', scope: $scope }); 
                //close dialog box after 4 seconds.
                setTimeout(
                    function() { 
                        ngDialog.close(); 
                    }, 4000
                );
            }
        );
    };

}])
.controller('AdminController', ['$scope', 'gossipsFactory', 'ngDialog', function ($scope, gossipsFactory, ngDialog) {

	$scope.gossip = {
		category: "",
		newsagency: "",
		link: "",
		caption: "",
		gossip: ""
	};

	$scope.postGossip = function () {
        gossipsFactory.save($scope.gossip, function(response) { 

                ngDialog.openConfirm({ 
                	template: 'views/gossipsuccess.html', 
                	className: 'ngdialog-theme-default',
                	scope: $scope 
                }); // success dialog box configuration...

                ngDialog.close(); //ensure that all opened dialog boxes are closed..
                $scope.gossip = { 
                    category: "", 
                    newsagency: "", 
                    link: "", 
                    caption: "", 
                    gossip: "" 
                }; //setting values back to defaults..
            }, 
            function(error) {

                console.log("Error: " + error.status + " " + error.statusText); //log error to console.
        	    ngDialog.open({ 
        	    	template: 'views/gossipfailed.html', 
        	    	className: 'ngdialog-theme-default',
        	    	scope: $scope 
        	    }); //failure dialog box config. 

                setTimeout(function() { 
                    ngDialog.close(); 
                }, 4000); //close dialog box after 4 seconds.
            }
        );
	};

}])
.controller('HeaderController', ['$scope', '$state', 'meFactory', function ($scope, $state, meFactory) {

    $scope.user = {};

    meFactory.loadUser();

    user = meFactory.user;

    setInterval(meFactory.loadUser, 60 * 60 * 1000);

    //facebook login()
    $scope.login = function() {
        meFactory.login();
    };
    
    //facebook logout()
    $scope.logOut = function() {
        meFactory.logout();
    };

    //stateis === ui-sref
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };

    setTimeout(function() {
        $scope.$emit('HeaderController');
    }, 0);
    
}])
;