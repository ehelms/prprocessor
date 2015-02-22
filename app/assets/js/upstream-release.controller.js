(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('UpstreamReleaseController', UpstreamReleaseController)

    UpstreamReleaseController.$inject = ['UpstreamRelease'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:UpstreamReleaseController
     *
     * @description
     *   Enter a description!
     */
    function UpstreamReleaseController(UpstreamRelease) {
        var self = this;

        self.fetchIssues = function(release) {
            self.working = true;

            UpstreamRelease.fetchIssues(self.versions[release].katello, self.versions[release].foreman)

            UpstreamRelease.issues.then(function (issues) {
                self.issues = issues;
                self.working = false;
            });
        }

        self.type = 'open';
        self.version = {};
        self.versions = {
            '1.7_2.1': {label: '1.7 & 2.1', katello: 14, foreman: 21},
            '1.8_2.2': {label: '1.8 & 2.2', katello: 23, foreman: 28}
        }

        self.openIssue = UpstreamRelease.openIssue;
        self.closedIssue = UpstreamRelease.closedIssue;

        self.setType = function (type) {
            self.type = type;
        };

        self.bugzillaId = function (issue) {
            var id = '';

            angular.forEach(issue['custom_fields'], function (field, key) {
                if (field.name === 'Bugzilla link') {
                    id = field.value;
                }
            });

            return id;
        };
    };

})();
