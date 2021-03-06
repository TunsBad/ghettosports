'use strict';

angular.module('ghettoSports', ['ui.router','ngResource','ngDialog', 'jtt_footballdata'])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider        
            // route for the home page
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })

            .state('app.headlines', {
                url: 'headlines',
                views: {
                    'content@': {
                        templateUrl : 'views/headlines.html',
                        controller : 'NewsController'
                    }
                }
            })

            .state('app.about', {
                url: 'about',
                views: {
                    'content@': {
                        templateUrl : 'views/about.html',
                        controller : 'AboutController'
                    }
                }
            })

            .state('app.contact', {
                url: 'contact',
                views: {           
                    'content@': {
                        templateUrl : 'views/contact.html',
                        controller : 'ContactController'
                    }
                }
            })

            .state('app.administrator', {
                url: 'administrator',
                views: { 
                    'header@': {
                        templateUrl : 'views/adminheader.html',
                        controller : 'HeaderController'
                    },          
                    'content@': {
                        templateUrl : 'views/administrator.html',
                        controller : 'AdminController'
                    }
                }
            });
        
        $urlRouterProvider.otherwise('/');
    })
;
