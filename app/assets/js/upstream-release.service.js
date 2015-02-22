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

        self.fetchIssues = function (katello, foreman) {
            return $q.all([$http.get('/api/upstream/release/katello/' + katello), $http.get('/api/upstream/release/foreman/' + foreman)]).then(function (responses) {
                var issues = [];

                angular.forEach(responses, function (response) {
                    issues = issues.concat(response.data);
                });

                deferred.resolve(issues);
            });
        }

        self.openIssue = function (issue) {
            return !self.closedIssue(issue);
        };

        self.closedIssue = function (issue) {
            return closedStatuses.indexOf(issue['status'].name) > -1;
        };

    };

})();
