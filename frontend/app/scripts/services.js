'use strict';

angular.module('ghettoSports')

.constant("baseURL", "https://ghettosports.herokuapp.com/")
//.constant("baseURL", "http://localhost:5000/")

.factory('enquiriesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "enquiries/:id", null, {
        'update': { method: 'PUT' }
    });
}])
.factory('gossipsFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
	return $resource(baseURL + "gossips/:id", null, {
        'update': { method: 'PUT' }
	});
}])
.factory('usersFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
	return $resource(baseURL + "users/", null, {
        'update': { method: 'PUT' }
	});
}])
.factory('ghstoriesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "ghstories/:id", null, {
        'update': { method: 'PUT' }
    });
}])
.factory('topstoriesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "topstories/:id", null, {
        'update': { method: 'PUT' }
    });
}])
.factory('webstoriesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "webstories/:id", null, {
        'update': { method: 'PUT' }
    });
}])
.factory('headlinesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "headlines/", null, {
        'update': { method: 'PUT' }
    });
}])
.factory('meFactory', ['$http', 'baseURL', '$resource', function ($http, baseURL, $resource) {

    var currentUser = {};

    currentUser.loadUser = function() {
        $http 
            .get(baseURL + "users/me") // returns req.user property.
                .success(function(response) { //using success and error callback functions in http module.
                    currentUser.user = response;
                    $http.defaults.headers.common['x-access-token'] = response.data.OauthToken;
                })
                .error(function(error) {
                    console.log("Error: " + error.status + " " + error.statusText);
                })
    };

    function destroyUserCredentials() {
        $http.defaults.headers.common['x-access-token'] = undefined;
    };

    currentUser.login = function() {
        $resource(baseURL + "users/facebook").get(function() { });
    };

    currentUser.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) { });
        destroyUserCredentials();
    };

    return currentUser;

}])
;