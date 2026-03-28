app.controller('PostController', ['$scope', '$location', 'postService', function($scope, $location, postService) {
    $scope.post = {};
    $scope.error = '';

    $scope.create = function() {
        postService.createPost($scope.post)
            .then(function(res) {
                $location.path('/dashboard');
            })
            .catch(function(err) {
                $scope.error = err.data && err.data.message ? err.data.message : 'Failed to create post';
            });
    };
}]);

app.controller('PostDetailController', ['$scope', '$routeParams', '$location', 'postService', 'authService', function($scope, $routeParams, $location, postService, authService) {
    $scope.post = null;
    $scope.comments = [];
    $scope.newComment = '';
    $scope.currentUser = authService.getCurrentUser();

    postService.getPost($routeParams.id).then(function(res) {
        $scope.post = res.data;
    });

    function loadComments() {
        postService.getComments($routeParams.id).then(function(res) {
            $scope.comments = res.data;
        });
    }

    $scope.addComment = function() {
        if (!$scope.newComment || !$scope.newComment.trim()) return;
        postService.addComment($routeParams.id, $scope.newComment).then(function(res) {
            $scope.newComment = '';
            loadComments();
        });
    };

    $scope.deleteComment = function(id) {
        if(confirm('Delete comment?')){
            postService.deleteComment(id).then(function() {
                loadComments();
            });
        }
    };

    $scope.isCommentAuthor = function(comment) {
        return $scope.currentUser && comment.author && $scope.currentUser._id === comment.author._id;
    };
    
    $scope.toggleCommentLike = function(comment) {
        if(!$scope.currentUser) return;
        postService.likeComment(comment._id).then(function(res) {
            comment.likes = res.data;
        });
    };

    $scope.hasCommentLiked = function(comment) {
        if(!$scope.currentUser || !comment || !comment.likes) return false;
        return comment.likes.includes($scope.currentUser._id);
    };

    $scope.isAuthor = function() {
        return $scope.currentUser && $scope.post && $scope.post.author && $scope.currentUser._id === $scope.post.author._id;
    };

    $scope.toggleLike = function() {
        if(!$scope.currentUser) return;
        postService.likePost($scope.post._id).then(function(res) {
            // Update UI manually for visual reflect
            const origLikes = $scope.post.likes.map(l => l._id || l);
            if (origLikes.includes($scope.currentUser._id)) {
                $scope.post.likes = $scope.post.likes.filter(l => (l._id || l) !== $scope.currentUser._id);
            } else {
                $scope.post.likes.push({_id: $scope.currentUser._id, username: $scope.currentUser.username});
            }
        });
    };

    $scope.hasLiked = function() {
        if(!$scope.currentUser || !$scope.post || !$scope.post.likes) return false;
        const likedIds = $scope.post.likes.map(l => l._id || l);
        return likedIds.includes($scope.currentUser._id);
    };

    loadComments();
}]);
