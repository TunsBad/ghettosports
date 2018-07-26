'use strict';

angular.module('ghettoSports')

    .controller('HomeController', ['$scope', 'gossipsFactory', '$http', 'topstoriesFactory', 'ghstoriesFactory', 'headlinesFactory', 'webstoriesFactory', 'footballdataFactory', function($scope, gossipsFactory, $http, topstoriesFactory, ghstoriesFactory, headlinesFactory, webstoriesFactory, footballdataFactory) {

        var apiKey = "aa49c8a561634243b60c7d74cca5975b";
        var currentHeadline = {};

        $scope.showGossips = false;
        $scope.showTop = false;
        $scope.showHline = false;
        $scope.showGh = false;
        $scope.showSR = false;
        $scope.showAF = false;

        $scope.message = "Loading ....";
        $scope.messageTop = "Loading ....";
        $scope.messageGh = "Loading ....";
        $scope.messageHline = "Loading ....";
        $scope.messageSR = "Loading ....";
        $scope.messageAF = "Loading ...."

        $scope.searchText = {};

        var GetFixtures = function() {

            footballdataFactory.getFixturesBySeason({
                id: 445,
                matchday: 38,
                apiKey: apiKey,
            }).then(function(_data) {
                $scope.fixtures = _data.data.fixtures;
                console.info("getFixturesBySeason", $scope.fixtures);
            }).catch(function(_data) {
                console.info("error", _data.data);
            });
        };

        var GetHeadlines = function() {

            headlinesFactory.query(
                function(response) {
                    currentHeadline = response.pop();
                    $scope.currentHeadline = currentHeadline;
                    $scope.HeadlineTimeDiffHrs = Math.floor(currentHeadline.TimeDifference / (60 * 60 * 1000));
                    $scope.HeadlineTimeDiffMins = Math.floor(currentHeadline.TimeDifference / (60 * 1000));
                    $scope.updatedat = currentHeadline.toUTC.split(' ')[0] + ' ' + currentHeadline.toUTC.split(' ')[4];
                    $scope.showHline = true;
                },
                function(error) {
                    $scope.messageHline = "Error : " + error.status + " " + error.statusText;
                }
            );
        };

        var GetGossips = function() {

            gossipsFactory.query(
                function(response) {
                    $scope.gossips = response;
                    $scope.showGossips = true;
                },
                function(error) {
                    $scope.message = "Error : " + error.status + " " + error.statusText;
                }
            );
        };

        var GetTopStories = function() {

            topstoriesFactory.query(
                function(response) {
                    $scope.topstories = response;
                    $scope.showTop = true;
                },
                function(error) {
                    $scope.messageTop = "Error : " + error.status + " " + error.statusText;
                }
            );
        };

        var GetGhStories = function() {

            ghstoriesFactory.query(
                function(response) {
                    $scope.ghstories = response;
                    $scope.showGh = true;
                },
                function(error) {
                    $scope.messageGh = "Error : " + error.status + " " + error.statusText;
                }
            );
        }

        var GetWebStories = function() {

            webstoriesFactory.query(
                function(response) {
                    $scope.afstories = response;
                    $scope.showAF = true;
                },
                function(error) {
                    $scope.messageAF = "Error : " + error.status + " " + error.statusText;
                }
            );
        };

        GetHeadlines();
        GetGossips();
        GetTopStories();
        GetGhStories();
        GetWebStories();
        GetFixtures();

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
                });
        };

        $scope.shareBtn = function() {
            FB.ui({
                method: 'share',
                href: 'https://ghettosports.herokuapp.com/'
            }, function(response) {});
        };

        setTimeout(function() {
            $scope.$emit('HomeController');
        }, 0);

    }]);