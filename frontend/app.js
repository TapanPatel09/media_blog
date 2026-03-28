const app = angular.module('blogApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'AuthController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            resolve: {
                auth: ['AuthService', '$location', function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }]
            }
        })
        .when('/create-blog', {
            templateUrl: 'views/createBlog.html',
            controller: 'CreateBlogController',
            resolve: {
                auth: ['AuthService', '$location', function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }]
            }
        })
        .when('/edit-blog/:id', {
            templateUrl: 'views/createBlog.html',
            controller: 'CreateBlogController',
            resolve: {
                auth: ['AuthService', '$location', function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }]
            }
        })
        .when('/blog/:id', {
            templateUrl: 'views/blogDetail.html',
            controller: 'BlogDetailController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('NavController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    };

    $scope.getUser = function() {
        return AuthService.getUser();
    };

    $scope.logout = function(event) {
        if(event) event.preventDefault();
        AuthService.logout();
        $location.path('/login');
    };
}]);

// Generic Interceptor to add JWT token
app.factory('AuthInterceptor', ['$window', function($window) {
    return {
        request: function(config) {
            const user = JSON.parse($window.localStorage.getItem('user'));
            if (user && user.token) {
                config.headers.Authorization = 'Bearer ' + user.token;
            }
            return config;
        }
    };
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);
