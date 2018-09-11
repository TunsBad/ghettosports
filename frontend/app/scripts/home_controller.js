'use strict';

angular.module('ghettoSports')

    .controller('HomeController', ['$scope', 'gossipsFactory', '$http', 'topstoriesFactory', 'ghstoriesFactory', 'headlinesFactory', 'webstoriesFactory', function($scope, gossipsFactory, $http, topstoriesFactory, ghstoriesFactory, headlinesFactory, webstoriesFactory) {

        var apiKey = "aa49c8a561634243b60c7d74cca5975b";
        var currentHeadline = {};
        var seasonId = '';
        var leagueIndex = 0;
        var LeaguesStandingIndex = 0;

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

        var LeagueSeasonId = '';
        var LeagueSeasonIdStanding = '';
        var currentMatchday = '';

        $scope.currentLeague = selectedLeagues[leagueIndex].name;
        var currentLeague = selectedLeagues[leagueIndex].name;
        var currentLeagueCode = selectedLeagues[leagueIndex].code;

        $scope.currentLeagueStandingTable = selectedLeagues[LeaguesStandingIndex].name;
        var currentLeagueStandingTable = selectedLeagues[LeaguesStandingIndex].name;
        var currentLeagueStandingTableCode = selectedLeagues[LeaguesStandingIndex].code;

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

        var GetLeagueIdFixtures = function(leagueName, code) {
            var data = '';

            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/',
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                var name = '';
                data = response.data.competitions;
                console.log(data);

                for (var i = 0; i <= data.length; i++) {
                    name = data[i].name;
                    if (name == leagueName && data[i].code == code) {
                        LeagueSeasonId = data[i].id;
                        console.log(LeagueSeasonId);
                        break;
                    };
                };

                GetCurrentMatchday(LeagueSeasonId)

            }, function errorCallback(response) {
                console.log(response);
            });
        }

        var GetCurrentMatchday = function(leagueid) {
            var season = '';

            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/' + leagueid + '/standings',
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                season = response.data.season;
                $scope.currentMatchday = season.currentMatchday;
                currentMatchday = season.currentMatchday;
                console.log(response.data.season);

                MatchdayGames(LeagueSeasonId, currentMatchday)
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
                $scope.fixtures = response.data.matches;

            }, function errorCallback(response) {
                console.log(response);

            });
        };

        var GetLeagueIdStandings = function(leagueName, code) {
            var data = '';

            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/',
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                var name = '';
                data = response.data.competitions;

                for (var i = 0; i <= data.length; i++) {
                    name = data[i].name;
                    if (name == leagueName && data[i].code == code) {
                        LeagueSeasonIdStanding = data[i].id;
                        console.log(LeagueSeasonIdStanding);
                        break;
                    };
                };

                GetCurrentLeagueTable(LeagueSeasonIdStanding)

            }, function errorCallback(response) {
                console.log(response);
            });
        }

        var GetCurrentLeagueTable = function(leagueid) {
            var season = '';

            $http({
                method: 'GET',
                url: 'http://api.football-data.org/v2/competitions/' + leagueid + '/standings',
                headers: {
                    'X-Auth-Token': apiKey
                },
            }).then(function successCallback(response) {
                season = response.data.standings[0]
                $scope.standings = season.table;

             }, function errorCallback(response) {
                console.log(response);

            });
        }

        GetHeadlines();
        GetGossips();

        GetLeagueIdFixtures(currentLeague,  currentLeagueCode);
        GetLeagueIdStandings(currentLeagueStandingTable,  currentLeagueStandingTableCode);

        $scope.GetLeagueStandingsIndexIncreased = function() {
            LeaguesStandingIndex += 1
            if (LeaguesStandingIndex > (selectedLeagues.length - 1))
                LeaguesStandingIndex = 0;
            $scope.currentLeagueStandingTable = selectedLeagues[LeaguesStandingIndex].name;
            currentLeagueStandingTable = selectedLeagues[LeaguesStandingIndex].name;
            currentLeagueStandingTableCode = selectedLeagues[LeaguesStandingIndex].code;
            GetLeagueIdStandings(currentLeagueStandingTable, currentLeagueStandingTableCode);
        }

        $scope.GetLeagueStandingsIndexReduced = function() {
            LeaguesStandingIndex -= 1
            if (LeaguesStandingIndex < 0)
                LeaguesStandingIndex = 2;
            $scope.currentLeagueStandingTable = selectedLeagues[LeaguesStandingIndex].name;
            currentLeagueStandingTable = selectedLeagues[LeaguesStandingIndex].name;
            currentLeagueStandingTableCode = selectedLeagues[LeaguesStandingIndex].code;
            GetLeagueIdStandings(currentLeagueStandingTable, currentLeagueStandingTableCode);
        }

        $scope.GetLeagueWithIncreasedIndex = function() {
            leagueIndex += 1
            if (leagueIndex > (selectedLeagues.length - 1))
                leagueIndex = 0;
            $scope.currentLeague = selectedLeagues[leagueIndex].name;
            currentLeague = selectedLeagues[leagueIndex].name;
            currentLeagueCode = selectedLeagues[leagueIndex].code;
            GetLeagueIdFixtures(currentLeague, currentLeagueCode);
        }

        $scope.GetLeagueWithDecreasedIndex = function() {
            leagueIndex -= 1
            if (leagueIndex < 0)
                leagueIndex= 2;
            $scope.currentLeague = selectedLeagues[leagueIndex].name;
            currentLeague = selectedLeagues[leagueIndex].name;
            currentLeagueCode = selectedLeagues[leagueIndex].code;
            GetLeagueIdFixtures(currentLeague, currentLeagueCode);
        }

        $scope.nextMatchdayGames = function() {
            $scope.currentMatchday += 1;
            currentMatchday += 1;
            if (currentMatchday == 21) {
                $scope.currentMatchday -= 1;
                currentMatchday -= 1;
            }
            console.log(LeagueSeasonId, currentMatchday);
            MatchdayGames(LeagueSeasonId, currentMatchday)
        };

        $scope.previousMatchdayGames = function() {
            $scope.currentMatchday -= 1;
            currentMatchday -= 1;
            if (currentMatchday == 0) {
                $scope.currentMatchday += 1;
                currentMatchday += 1;

            }
            console.log(LeagueSeasonId, currentMatchday);
            MatchdayGames(LeagueSeasonId, currentMatchday)
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


//url: 'http://api.football-data.org/v2/players/7801',
//url: 'http://api.football-data.org/v2/teams/57',

//var todayISOS = new Date().toISOString().slice(0, 10);
//var today = new Date();
//today.setDate(today.getDate() - 10);
//var tendaysISO = today.toISOString();
//var tendaysISOS = tendaysISO.slice(0, 10);

/*var GetFixtures = function() {

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
*/