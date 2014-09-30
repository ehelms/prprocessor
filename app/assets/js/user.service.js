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

        this.fetch = function () {
            $http.get('/user').success(function (response) {
                self.username = response.user;
            });
        };

        this.logout = function () {
            var logout = $http.post('/logout');

            logout.then(function () {
                self.fetch();
            });

            return logout;
        };

        self.fetch();
    };

})();
