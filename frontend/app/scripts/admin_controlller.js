'use strict';

angular.module('ghettoSports')

   
    .controller('AdminController', ['$scope', 'gossipsFactory', 'ngDialog', function($scope, gossipsFactory, ngDialog) {

        $scope.gossip = {
            category: "",
            newsagency: "",
            link: "",
            caption: "",
            gossip: ""
        };

        $scope.postGossip = function() {
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
                    },
                    function(error) {}; //setting values back to defaults..

                console.log("Error: " + error.status + " " + error.statusText); //log error to console.
                ngDialog.open({
                    template: 'views/gossipfailed.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }); //failure dialog box config. 

                setTimeout(function() {
                    ngDialog.close();
                }, 4000); //close dialog box after 4 seconds.
            });
        };

    }])