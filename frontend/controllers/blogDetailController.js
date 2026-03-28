angular.module('blogApp').controller('BlogDetailController', ['$scope', 'BlogService', '$routeParams', 'AuthService', function($scope, BlogService, $routeParams, AuthService) {
    $scope.blog = null;
    $scope.comments = [];
    $scope.commentData = { text: '' };
    $scope.loading = true;
    $scope.currentUser = AuthService.getUser();
    $scope.isAuthenticated = AuthService.isAuthenticated();

    const blogId = $routeParams.id;

    $scope.loadData = function() {
        BlogService.getBlog(blogId).then(function(response) {
            $scope.blog = response.data;
            if ($scope.currentUser) {
                $scope.isLikedByMe = $scope.blog.likes.includes($scope.currentUser._id);
            }
            $scope.loading = false;
        }).catch(console.error);

        BlogService.getComments(blogId).then(function(response) {
            $scope.comments = response.data;
        }).catch(console.error);
    };

    $scope.toggleLike = function() {
        if (!$scope.isAuthenticated) return alert("Please log in to like.");
        BlogService.toggleLike(blogId).then(function(response) {
            $scope.blog.likes = response.data;
            $scope.isLikedByMe = $scope.blog.likes.includes($scope.currentUser._id);
        }).catch(console.error);
    };

    $scope.addComment = function() {
        if (!$scope.commentData.text) return;
        BlogService.addComment(blogId, $scope.commentData.text).then(function(response) {
            $scope.comments.unshift(response.data);
            $scope.commentData.text = '';
        }).catch(function(error) {
            alert('Failed to add comment');
            console.error(error);
        });
    };

    $scope.deleteComment = function(commentId) {
        if (confirm('Delete this comment?')) {
            BlogService.deleteComment(commentId).then(function() {
                $scope.comments = $scope.comments.filter(function(c) {
                    return c._id !== commentId;
                });
            }).catch(function(error) {
                alert('Failed to delete comment');
                console.error(error);
            });
        }
    };

    $scope.loadData();
}]);
