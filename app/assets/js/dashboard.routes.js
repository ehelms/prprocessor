(function () {
    'use strict';

    angular
        .module('Dashboard')
        .config(DashboardRoutes)

    DashboardRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    /**
     * @ngdoc config
     * @name  Dashboard.config:DashboardRoutes
     *
     * @description
     *   Enter a description!
     */
    function DashboardRoutes($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/dashboard');
        $locationProvider.html5Mode(true);


        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/assets/views/dashboard.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/assets/views/login.html',
                controller: 'LoginController as login'
            })
            .state('downstream', {
                url: '/dashboard/downstream',
                templateUrl: '/assets/views/downstream-release.html',
                controller: 'DownstreamReleaseController as release'
            })
            .state('upstream', {
                url: '/dashboard/upstream',
                templateUrl: '/assets/views/upstream-release.html',
                controller: 'UpstreamReleaseController as release'
            })
            .state('issue', {
                url: '/dashboard/issues/:issueId',
                templateUrl: '/assets/views/issue.html',
                controller: 'IssueController as issue'
            })
            .state('bugzilla', {
                url: '/dashboard/bugzilla/:bugzillaId',
                templateUrl: '/assets/views/issue.html',
                controller: 'BugzillaController as issue'
            });
    };

})();
