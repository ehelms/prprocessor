(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('LoginController', LoginController)

    LoginController.$inject = ['$http', '$state', 'User'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:LoginController
     *
     * @description
     *   Enter a description!
     */
    function LoginController($http, $state, User) {
        var self = this;

        self.postLogin = function (user, password) {
            $http.post('/login', {user: user, password: password}).success(function () {
                User.fetch();
                $state.go('downstream');
            });
        }

    };

})();
