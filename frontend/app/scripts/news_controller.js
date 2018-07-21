'use strict';

angular.module('ghettoSports')
    .controller('NewsController', ['$scope', '$http', 'footballdataFactory', function($scope, $http, footballdataFactory) {

        var apiKey = "aa49c8a561634243b60c7d74cca5975b";
        var Seasons = [];
        var PremierLeagueId = "";
        var LaLigaId = "";
        var SaLeagueId = "";

        $scope.showSPB = false;
        $scope.showFFT = false;
        $scope.showTS = false;

        $scope.messageSPB = "Loading ....";
        $scope.messageFFT = "Loading ....";
        $scope.messageTS = "Loading ....";


        var FourFourTwoHeadlines = function() {

            $http.get('https://newsapi.org/v2/top-headlines?sources=four-four-two&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
                .then(function(response) {
                    $scope.fourfourtwo = response.data;
                    $scope.showFFT = true;
                }, function(error) {
                    $scope.messageFFT = "Error: " + error.status + " " + error.statusText;
                });
        };

        var TalkSportHeadlines = function() {

            $http.get('https://newsapi.org/v2/top-headlines?sources=talksport&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
                .then(function(response) {
                    $scope.talksport = response.data;
                    $scope.showTS = true;
                }, function(error) {
                    $scope.messageTS = "Error: " + error.status + " " + error.statusText;
                });
        };

        var SportBibleHeadlines = function() {

            $http.get('https://newsapi.org/v2/top-headlines?sources=the-sport-bible&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
                .then(function(response) {
                    $scope.thesportbible = response.data;
                    $scope.showSPB = true;
                }, function(error) {
                    $scope.messageSPB = "Error: " + error.status + " " + error.statusText;
                });
        };

        var GetPlTable = function(seasonId) {

            footballdataFactory.getLeagueTableBySeason({
                id: seasonId,
                apiKey: apiKey,
            }).then(function(_data) {
                $scope.plstanding = _data.data.standing;
                console.info("PlTable", $scope.plstanding);
            }).catch(function(_data) {
                console.info("Error", _data.data);
            });

        };

        var GetPdTable = function(seasonId) {

            footballdataFactory.getLeagueTableBySeason({
                id: seasonId,
                apiKey: apiKey,
            }).then(function(_data) {
                $scope.pdstanding = _data.data.standing;
                console.info("PdTable", _data.data.standing);
            }).catch(function(_data) {
                console.info("Error", _data.data);
            });

        };

        var GetSATable = function(seasonId) {

            footballdataFactory.getLeagueTableBySeason({
                id: seasonId,
                apiKey: apiKey,
            }).then(function(_data) {
                $scope.sastanding = _data.data.standing;
                console.info("PdTable", _data.data.standing);
            }).catch(function(_data) {
                console.info("Error", _data.data);
            });

        };

        var GetCurrentSeasonTable = function() {

            footballdataFactory.getSeasons({
                    apiKey: apiKey, // Register for a free api key: http://api.football-data.org/register
                }).then(function(_data) {

                    Seasons = _data.data
                    console.log("Seasons", Seasons)
                    SetLeagueIds(Seasons);
                    GetPlTable(PremierLeagueId);
                    GetPdTable(LaLigaId);
                    GetSATable(SaLeagueId);
                })
                .catch(function(_data) {
                    console.log("Error loading Seasons, Please contact football-data.org");
                   console.log("Error: ", _data);
                });

        };

        GetCurrentSeasonTable();
        FourFourTwoHeadlines();
        TalkSportHeadlines();
        SportBibleHeadlines();

        var SetLeagueIds = function(Seasons) {
            for (var season = 0; season <= (Seasons.length - 1); season++) {
                switch (Seasons[season].league) {
                    case "PL":
                        PremierLeagueId = Seasons[season].id;
                        break;
                    case "PD":
                        LaLigaId = Seasons[season].id;
                        break;
                    case "SA":
                        SaLeagueId = Seasons[season].id;
                        break;
                    default:
                        if (season == (Seasons.length - 1)) {
                            break;
                        } else {
                            continue;
                        }
                }
            };
        }

        $scope.shareBtn = function() {
            FB.ui({
                method: 'share',
                href: 'https://ghettosports.herokuapp.com/'
            }, function(response) {});
        };

        setTimeout(function() {
            $scope.$emit('NewsController');
        }, 0);

    }]);