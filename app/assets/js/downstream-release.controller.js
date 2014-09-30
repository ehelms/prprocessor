(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('DownstreamReleaseController', DownstreamReleaseController)

    DownstreamReleaseController.$inject = ['DownstreamRelease', '$http', '$state', 'User'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:DownstreamReleaseController
     *
     * @description
     *   Enter a description!
     */
    function DownstreamReleaseController(DownstreamRelease, $http, $state, User) {
        var self = this;

        self.type = 'open';

        self.openIssues = [];
        self.closedIssues = [];
        self.state = "approved";
        self.release = "";
        self.user = User;

        self.setType = function (type) {
            self.type = type;

            if (type === 'open') {
                self.fetchOpenIssues();
            } else if (type === 'closed') {
                self.fetchClosedIssues();
            }
        };

        self.releaseChanged = function() {
            self.openIssues = [];
            self.fetchOpenIssues();
        };

        self.stateChanged = function() {
            self.openIssues = [];
            self.fetchOpenIssues();
        };

        this.fetchOpenIssues = function() {
            var limit = 20,
                offset = self.openIssues.length;

            if (self.type === 'open' && self.release !== "") {
                self.working = true;

                DownstreamRelease.openIssues(self.release, {limit: limit, offset: offset, state: self.state}).then(function (issues) {
                    if (offset === 0) {
                        self.openIssues = issues.data.result.bugs;
                    } else {
                        self.openIssues = self.openIssues.concat(issues.data.result.bugs);
                    }

                    self.working = false;
                });
            }
        }

        this.fetchClosedIssues = function() {
            var limit = 20,
                offset = self.openIssues.length;

            if (self.type === 'closed' && self.release !== "") {
                self.working = true;

                DownstreamRelease.closedIssues(self.release, {limit: limit, offset: offset, state: self.state}).then(function (issues) {
                    if (offset === 0) {
                        self.closedIssues = issues.data.result.bugs;
                    } else {
                        self.closedIssues = self.closedIssues.concat(issues.data.result.bugs);
                    }

                    self.working = false;
                });
            }
        }

        this.queryLink = function () {
            var url = "https://bugzilla.redhat.com/buglist.cgi?";

            if (self.state === "approved" || self.state === "blocker") {
                url += "v1=sat-" + self.release + "%2B";
            } else {
                url += "v1=sat-" + self.release + "?";
            }

            url += "&o1=substring";
            url += "&f1=flagtypes.name";

            if (self.state === "blocker") {
                url += "v2=blocker+";
                url += "o2=substring";
                url += "&f2=flagtypes.name";
            }

            url += "&query_format=advanced";
            url += "&product=Red Hat Satellite 6";

            return url;
        };

    };

})();
