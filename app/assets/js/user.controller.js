(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('UserController', UserController)

    UserController.$inject = ['$state', 'User'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:UserController
     *
     * @description
     *   Enter a description!
     */
    function UserController($state, User) {
        var self = this;

        self.user = User;

        self.logout = function () {
            User.logout().then(function () {
                $state.go('dashboard');
            });
        };

    };

})();
