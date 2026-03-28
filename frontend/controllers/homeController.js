angular.module('blogApp').controller('HomeController', ['$scope', 'BlogService', function($scope, BlogService) {
    $scope.blogs = [];
    $scope.loading = true;
    $scope.error = null;

    $scope.loadBlogs = function() {
        BlogService.getBlogs().then(function(response) {
            $scope.blogs = response.data.blogs;
            $scope.loading = false;
        }).catch(function(error) {
            $scope.error = 'Failed to load blogs';
            $scope.loading = false;
            console.error(error);
        });
    };

    $scope.loadBlogs();
}]);
