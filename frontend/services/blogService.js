angular.module('blogApp').factory('BlogService', ['$http', function($http) {
    const API_URL = 'http://localhost:5000/api/blogs/';
    const COMMENT_API_URL = 'http://localhost:5000/api/';

    return {
        getBlogs: function() {
            return $http.get(API_URL);
        },
        getBlog: function(id) {
            return $http.get(API_URL + id);
        },
        createBlog: function(blogData) {
            return $http.post(API_URL, blogData);
        },
        updateBlog: function(id, blogData) {
            return $http.put(API_URL + id, blogData);
        },
        deleteBlog: function(id) {
            return $http.delete(API_URL + id);
        },
        toggleLike: function(id) {
            return $http.post(API_URL + id + '/like');
        },
        getComments: function(blogId) {
            return $http.get(COMMENT_API_URL + 'blogs/' + blogId + '/comments');
        },
        addComment: function(blogId, text) {
            return $http.post(COMMENT_API_URL + 'blogs/' + blogId + '/comment', { text: text });
        },
        deleteComment: function(commentId) {
            return $http.delete(COMMENT_API_URL + 'comments/' + commentId);
        }
    };
}]);
