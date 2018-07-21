'use strict';

angular.module('ghettoSports')

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