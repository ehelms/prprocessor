(function () {
    'use strict';

    angular
        .module('Dashboard')
        .service('UpstreamRelease', UpstreamRelease)

    UpstreamRelease.$inject = ['$http', '$q'];

    /**
     * @ngdoc service
     * @name  Dashboard.service:UpstreamRelease
     *
     * @description
     *   Enter a description!
     */
    function UpstreamRelease($http, $q) {
        var self = this,
            deferred = $q.defer(),
            closedStatuses = ['Closed', 'Rejected', 'Duplicate', 'Resolved'];

        self.issues = deferred.promise;

        $q.all([$http.get('/upstream/release/katello/14'), $http.get('/upstream/release/foreman/21')]).then(function (responses) {
            var issues = [];

            angular.forEach(responses, function (response) {
                issues = issues.concat(response.data.issues);
            });

            deferred.resolve(issues);
        });

        self.openIssue = function (issue) {
            return !self.closedIssue(issue);
        };

        self.closedIssue = function (issue) {
            return closedStatuses.indexOf(issue['status'].name) > -1;
        };

    };

})();
