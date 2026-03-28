angular.module('blogApp').controller('AuthController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.user = {
        name: '',
        email: '',
        password: ''
    };
    $scope.error = null;

    if (AuthService.isAuthenticated()) {
        $location.path('/dashboard');
    }

    $scope.login = function() {
        $scope.error = null;
        AuthService.login({ email: $scope.user.email, password: $scope.user.password })
            .then(function() {
                $location.path('/dashboard');
            })
            .catch(function(err) {
                $scope.error = err.data.message || 'Login failed. Please try again.';
            });
    };

    $scope.register = function() {
        $scope.error = null;
        AuthService.register($scope.user)
            .then(function() {
                $location.path('/dashboard');
            })
            .catch(function(err) {
                $scope.error = err.data.message || 'Registration failed. Please try again.';
            });
    };
}]);
