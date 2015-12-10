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
            })
            .state('sprints', {
                url: '/dashboard/sprints',
                templateUrl: '/assets/views/sprints.html',
                controller: 'SprintsController as sprints'
            })
            .state('sprint', {
                url: '/dashboard/sprints/:sprintId',
                templateUrl: '/assets/views/sprint.html',
                controller: 'SprintController as sprint'
            })
            .state('features', {
                url: '/dashboard/features/:project',
                templateUrl: '/assets/views/features.html',
                controller: 'FeaturesController as features'
            })
            .state('reviews', {
                url: '/dashboard/reviews',
                templateUrl: '/assets/views/reviews.html',
                controller: 'ReviewsController as reviews'
            });
    };

})();
