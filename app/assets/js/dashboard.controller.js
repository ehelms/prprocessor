(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('DashboardController', DashboardController)

    DashboardController.$inject = ['$http', '$state', 'User'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:DashboardController
     *
     * @description
     *   Enter a description!
     */
    function DashboardController($http, $state, User) {
        var self = this;

        if (!User.username) {
            $state.transitionTo('login');
        }

        $http.get('/api/bugzilla').success(function (bugzilla) {
            self.bugs = bugzilla.result.bugs;

            angular.forEach(self.bugs, function (bug) {
                bug['cf_pm_score'] = parseInt(bug['cf_pm_score']);
            });
        });

        $http.get('/api/pull_requests').success(function (pullRequests) {
            self.pullRequests = pullRequests;
        });

        self.pmScore = function (item) {
            return parseInt(item['cf_pm_score']);
        };

    };
})();
