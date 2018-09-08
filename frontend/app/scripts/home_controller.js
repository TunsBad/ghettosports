'use strict';

angular.module('ghettoSports')

    .controller('HomeController', ['$scope', 'gossipsFactory', '$http', 'topstoriesFactory', 'ghstoriesFactory', 'headlinesFactory', 'webstoriesFactory', 'footballdataFactory', function($scope, gossipsFactory, $http, topstoriesFactory, ghstoriesFactory, headlinesFactory, webstoriesFactory, footballdataFactory) {

        var apiKey = "aa49c8a561634243b60c7d74cca5975b";
        var currentHeadline = {};
        var seasonId = '';
        var leagueIndex = 0;
        var selectedLeagues = [{
            "name": "Premier League",
            "code": "PL"
        }, {
            "name": "Primera Division",
            "code": "PD"
        }, {
            "name": "Serie A",
            "code": "SA"
        }];

        $scope.currentLeague = selectedLeagues[leagueIndex].name;
        $scope.currentLeagueCode = selectedLeagues[leagueIndex].code;

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

        var GetLeagueId = function(leagueName, code) {
            var data = '';

            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/',
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                var name = '';
                var premierLeagueSeasonId = '';

                data = response.data.competitions;

                for (var i = 0; i <= data.length; i++) {
                    name = data[i].name;
                    if (name == leagueName && data[i].code == code) {
                        premierLeagueSeasonId = data[i].id;
                        $scope.premierLeagueSeasonId = premierLeagueSeasonId;
                        console.log(premierLeagueSeasonId);
                        break;
                    };
                };

                GetLeagueSeason(premierLeagueSeasonId);
            }, function errorCallback(response) {
                console.log(response);
            });
        }

        var GetLeagueSeason = function(leagueid) {
            var season = '';

            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/' + leagueid + '/standings',
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                console.log(response.data.season);

                season = response.data.season;
                $scope.currentMatchday = season.currentMatchday;

                //TODO: GET THE CURRENT LEAGUE STANDING HERE

                MatchdayGames(leagueid, $scope.currentMatchday);
            }, function errorCallback(response) {
                console.log(response);

            });
        }

        var MatchdayGames = function(leagueid, matchday) {
            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/' + leagueid + '/matches?matchday=' + matchday,
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                console.log(response);

            }, function errorCallback(response) {
                console.log(response);

            });
        }

        GetHeadlines();
        GetGossips();
        GetTopStories();
        GetGhStories();
        GetWebStories();
        GetFixtures();
        GetLeagueId($scope.currentLeague, $scope.currentLeagueCode);

        $scope.GetLeagueWithIncreasedIndex = function() {
            leagueIndex += 1
            $scope.currentLeague = selectedLeagues[leagueIndex].name;
            $scope.currentLeagueCode = selectedLeagues[leagueIndex].code;
            GetLeagueId($scope.currentLeague, $scope.currentLeagueCode)
        }

        $scope.GetLeagueWithDecreasedIndex = function() {
            leagueIndex -= 1
            $scope.currentLeague = selectedLeagues[leagueIndex].name;
            $scope.currentLeagueCode = selectedLeagues[leagueIndex].code;
            GetLeagueId($scope.currentLeague, $scope.currentLeagueCode)
        }

        $scope.nextMatchdayGames = function(leagueid) {
            $scope.currentMatchday += 1;
            if ($scope.currentMatchday == 21)
                $scope.currentMatchday -= 1;
            console.log(leagueid, $scope.currentMatchday);
            MatchdayGames(leagueid, $scope.currentMatchday)
        };

        $scope.previousMatchdayGames = function(leagueid) {
            $scope.currentMatchday -= 1;
            if ($scope.currentMatchday == 0)
                $scope.currentMatchday += 1;
            console.log(leagueid, $scope.currentMatchday);
            MatchdayGames(leagueid, $scope.currentMatchday)
        };

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


//var todayISOS = new Date().toISOString().slice(0, 10);
//var today = new Date();
//today.setDate(today.getDate() - 10);
//var tendaysISO = today.toISOString();
//var tendaysISOS = tendaysISO.slice(0, 10);