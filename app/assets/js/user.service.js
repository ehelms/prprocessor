(function () {
    'use strict';

    angular
        .module('Dashboard')
        .service('User', User)

    User.$inject = ['$http'];

    /**
     * @ngdoc service
     * @name  Dashboard.service:User
     *
     * @description
     *   Enter a description!
     */
    function User($http) {
        var self = this;

        self.username = null;
        self.github = null;

        this.fetch = function () {
            return $http.get('/api/user').success(function (response) {
                self.username = response.user;
                self.github = response.github;
            });
        };

        this.logout = function () {
            var logout = $http.post('/api/logout');

            logout.then(function () {
                self.fetch();
            });

            return logout;
        };

        this.isPresent = function () {
            return self.username || self.github;
        };

        self.fetch();
    };

})();
