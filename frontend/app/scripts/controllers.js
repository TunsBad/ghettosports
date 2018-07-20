'use strict';

angular.module('ghettoSports')

    .controller('HomeController', ['$scope', 'gossipsFactory', '$http', 'topstoriesFactory', 'ghstoriesFactory', 'headlinesFactory', 'webstoriesFactory', function($scope, gossipsFactory, $http, topstoriesFactory, ghstoriesFactory, headlinesFactory, webstoriesFactory) {

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

        var currentHeadline = {};

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

        gossipsFactory.query(
            function(response) {
                $scope.gossips = response;
                $scope.showGossips = true;
            },
            function(error) {
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

        webstoriesFactory.query(
            function(response) {
                $scope.afstories = response;
                $scope.showAF = true;
            },
            function(error) {
                $scope.messageAF = "Error : " + error.status + " " + error.statusText;
            }
        );

        //search
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

    }])
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
        }

        var TalkSportHeadlines = function() {

            $http.get('https://newsapi.org/v2/top-headlines?sources=talksport&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
                .then(function(response) {
                    $scope.talksport = response.data;
                    $scope.showTS = true;
                }, function(error) {
                    $scope.messageTS = "Error: " + error.status + " " + error.statusText;
                });
        }

        var SportBibleHeadlines = function() {

            $http.get('https://newsapi.org/v2/top-headlines?sources=the-sport-bible&apiKey=352ed8e2ce5e45d1b9abe1430fdd41e1')
                .then(function(response) {
                    $scope.thesportbible = response.data;
                    $scope.showSPB = true;
                }, function(error) {
                    $scope.messageSPB = "Error: " + error.status + " " + error.statusText;
                });
        }

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

        }

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

        }

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

        }

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
                    console.log("Error loading Seasons, Please contact football-data.org")
                    //Show ngDialog here !
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


        /*footballdataFactory.getFixturesBySeason({
            id: 445,
            //matchday: 10,
            apiKey: apiKey,
        }).then(function(_data) {
            console.info("getFixturesBySeason", _data.data.fixtures);
        }).catch(function(_data) {
            console.info("Error", _data.data);
        }); */


        $scope.shareBtn = function() {
            FB.ui({
                method: 'share',
                href: 'https://ghettosports.herokuapp.com/'
            }, function(response) {});
        };

        setTimeout(function() {
            $scope.$emit('NewsController');
        }, 0);

    }])
    .controller('AboutController', ['$scope', function($scope) {

        $scope.shareBtn = function() {
            FB.ui({
                method: 'share',
                href: 'https://ghettosports.herokuapp.com/'
            }, function(response) {});
        };

        setTimeout(function() {
            $scope.$emit('AboutController');
        }, 0); //check the $emit value on $scope

    }])
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
    .controller('HeaderController', ['$scope', '$state', 'meFactory', function($scope, $state, meFactory) {

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

    }]);