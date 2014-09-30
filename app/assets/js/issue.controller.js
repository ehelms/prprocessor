(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('IssueController', IssueController)

    IssueController.$inject = ['$stateParams', '$sce', '$http'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:IssueController
     *
     * @description
     *   Enter a description!
     */
    function IssueController($stateParams, $sce, $http) {
        var self = this;

        self.id = $stateParams.issueId;
        self.priorState = "/dashboard/upstream";

        $http.get('/issue/' + this.id).success(function (issue) {
            self.issue = issue.issue;

            $http.get('/bugzilla/' + self.issue.custom_fields[2].value).success(function (bugzilla) {
                self.bugzilla = bugzilla.result.bugs[0];

                if (self.bugzilla.blocks) {
                    $http.get('/bugzilla/' + self.bugzilla.id + '/clones', {blocker_ids: self.bugzilla.blocks}).success(function (clone) {
                        self.clone = clone.result.bugs[0];
                    });
                }
            });
        });

    };

})();
