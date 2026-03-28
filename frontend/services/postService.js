app.factory('postService', ['$http', function($http) {
    const API_URL = 'http://localhost:5000/api/posts/';
    const CMD_URL = 'http://localhost:5000/api/comments/';

    return {
        getPosts: function() { return $http.get(API_URL); },
        getPost: function(id) { return $http.get(API_URL + id); },
        createPost: function(data) { return $http.post(API_URL, data); },
        updatePost: function(id, data) { return $http.put(API_URL + id, data); },
        deletePost: function(id) { return $http.delete(API_URL + id); },
        likePost: function(id) { return $http.post(API_URL + id + '/like'); },
        getComments: function(postId) { return $http.get(CMD_URL + postId); },
        addComment: function(postId, content) { return $http.post(CMD_URL + postId, { content: content }); },
        deleteComment: function(id) { return $http.delete(CMD_URL + id); },
        likeComment: function(id) { return $http.post(CMD_URL + id + '/like'); }
    };
}]);
