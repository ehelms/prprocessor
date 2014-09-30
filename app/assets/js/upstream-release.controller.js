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

        self.working = true;
        UpstreamRelease.issues.then(function (issues) {
            self.issues = issues;
            self.working = false;
        });

        self.type = 'open';

        self.openIssue = UpstreamRelease.openIssue;
        self.closedIssue = UpstreamRelease.closedIssue;

        self.setType = function (type) {
            self.type = type;
        };
    };

})();
