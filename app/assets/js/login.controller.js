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

        self.postLogin = function (login) {
            $http.post('/api/login', login).success(function () {
                User.fetch().then(function () {
                    $state.transitionTo('dashboard');
                });
            });
        }

    };

})();
