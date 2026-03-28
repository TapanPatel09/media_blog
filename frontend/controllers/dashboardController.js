angular.module('blogApp').controller('DashboardController', ['$scope', 'BlogService', 'AuthService', function($scope, BlogService, AuthService) {
    $scope.blogs = [];
    $scope.currentUser = AuthService.getUser();
    $scope.loading = true;

    $scope.loadMyBlogs = function() {
        BlogService.getBlogs().then(function(response) {
            // Filter blogs for the current logged-in user
            $scope.blogs = response.data.blogs.filter(function(blog) {
                return blog.author._id === $scope.currentUser._id;
            });
            $scope.loading = false;
        }).catch(function(err) {
            console.error(err);
            $scope.loading = false;
        });
    };

    $scope.deleteBlog = function(id) {
        if(confirm('Are you sure you want to delete this blog?')) {
            BlogService.deleteBlog(id).then(function() {
                $scope.loadMyBlogs();
            }).catch(function(err) {
                alert('Failed to delete blog.');
                console.error(err);
            });
        }
    };

    $scope.loadMyBlogs();
}]);
