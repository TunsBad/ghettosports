'use strict';

angular.module('ghettoSports')

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