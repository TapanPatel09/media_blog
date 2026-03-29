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
        var formData = new FormData();
        formData.append('title', $scope.blog.title);
        formData.append('content', $scope.blog.content);
        
        var photoInput = document.getElementById('photoInput');
        if (photoInput && photoInput.files.length > 0) {
            formData.append('photo', photoInput.files[0]);
        }
        
        var videoInput = document.getElementById('videoInput');
        if (videoInput && videoInput.files.length > 0) {
            formData.append('video', videoInput.files[0]);
        }

        if ($scope.isEditing) {
            BlogService.updateBlogWithMedia($routeParams.id, formData).then(function() {
                $location.path('/dashboard');
            }).catch(function(err) {
                $scope.error = err.data.message || 'Failed to update blog';
            });
        } else {
            BlogService.createBlogWithMedia(formData).then(function() {
                $location.path('/dashboard');
            }).catch(function(err) {
                $scope.error = err.data.message || 'Failed to create blog';
            });
        }
    };
}]);
