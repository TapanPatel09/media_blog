angular.module('blogApp').controller('CreateBlogController', ['$scope', 'BlogService', '$location', '$routeParams', function($scope, BlogService, $location, $routeParams) {
    $scope.blog = {
        title: '',
        content: ''
    };
    $scope.isEditing = false;
    $scope.error = null;

    if ($routeParams.id) {
        $scope.isEditing = true;
        BlogService.getBlog($routeParams.id).then(function(response) {
            $scope.blog.title = response.data.title;
            $scope.blog.content = response.data.content;
        }).catch(function() {
            $scope.error = 'Failed to fetch blog';
        });
    }

    $scope.submitForm = function() {
        if ($scope.isEditing) {
            BlogService.updateBlog($routeParams.id, $scope.blog).then(function() {
                $location.path('/dashboard');
            }).catch(function(err) {
                $scope.error = err.data.message || 'Failed to update blog';
            });
        } else {
            BlogService.createBlog($scope.blog).then(function() {
                $location.path('/dashboard');
            }).catch(function(err) {
                $scope.error = err.data.message || 'Failed to create blog';
            });
        }
    };
}]);
