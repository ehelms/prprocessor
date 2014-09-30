(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('BugzillaController', BugzillaController)

    BugzillaController.$inject = ['$stateParams', '$sce', '$http'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:BugzillaController
     *
     * @description
     *   Enter a description!
     */
    function BugzillaController($stateParams, $sce, $http) {
        var self = this;

        self.id = $stateParams.bugzillaId;
        self.priorState = "/dashboard/downstream";

        $http.get('/bugzilla/' + this.id).success(function (bugzilla) {
            self.bugzilla = bugzilla.result.bugs[0];

            if (self.bugzilla.url !== "") {
                $http.get('/issue/' + self.bugzilla.url.split('http://projects.theforeman.org/issues/')[1]).success(function (issue) {
                    self.issue = issue.issue;
                });
            }

            if (self.bugzilla.blocks) {
                $http.get('/bugzilla/' + self.bugzilla.id + '/clones', {params: {'blocker_ids[]': self.bugzilla.blocks}}).success(function (clone) {
                    self.clone = clone.result.bugs[0];
                });
            }
        });

    };

})();
