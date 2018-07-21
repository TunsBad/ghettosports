'use strict';

angular.module('ghettoSports')
    .controller('ContactController', ['$scope', 'enquiriesFactory', 'ngDialog', function($scope, enquiriesFactory, ngDialog) {

        var mymap = L.map('mapid', {
            scrollWheelZoom: false
        }).setView([5.52, -0.48], 10);

        var marker = L.marker([5.52, -0.48]).addTo(mymap);

        marker.bindPopup("<b>Welcome !</b>");

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 16,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoidHVuZGViYWRtdXMiLCJhIjoiY2o5MDE0ODByMjdoNzMzcXVzYmppNDE0MCJ9.dxoVquDF9o3pPS1qtyrq_A'
        }).addTo(mymap);

        $scope.feedback = {
            name: "",
            phone: "",
            subject: "",
            comment: "",
            email: ""
        };

        //Send Button ....
        $scope.send = function() {
            enquiriesFactory.save($scope.feedback, function(response) {
                    //dialog box configuration.        
                    ngDialog.openConfirm({
                        template: 'views/enquirysuccess.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    //ensure that all opened dialog boxes are closed. 
                    ngDialog.close();
                    //set values back to defaults.
                    $scope.feedback = {
                        name: "",
                        phone: "",
                        subject: "",
                        comment: "",
                        email: ""
                    };
                    $scope.feedbackForm.$setPristine(); //clean form
                },
                function(error) {

                    console.log("Error: " + error.status + " " + error.statusText);
                    //dialog box config.
                    ngDialog.open({
                        template: 'views/enquiryfailed.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    //close dialog box after 4 seconds.
                    setTimeout(function() {
                        ngDialog.close()
                    }, 4000);
                }
            );
        };

    }])
