angular.module('blogApp').factory('AuthService', ['$http', '$window', function($http, $window) {
    const API_URL = 'http://localhost:5000/api/auth/';

    return {
        register: function(userData) {
            return $http.post(API_URL + 'register', userData).then(function(response) {
                if (response.data.token) {
                    $window.localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
        },
        login: function(userData) {
            return $http.post(API_URL + 'login', userData).then(function(response) {
                if (response.data.token) {
                    $window.localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
        },
        logout: function() {
            $window.localStorage.removeItem('user');
        },
        isAuthenticated: function() {
            const user = JSON.parse($window.localStorage.getItem('user'));
            return !!(user && user.token);
        },
        getUser: function() {
            return JSON.parse($window.localStorage.getItem('user'));
        }
    };
}]);
