(function () {
    'use strict';

    angular
        .module('Dashboard')
        .service('Feature', Feature)

    Feature.$inject = ['$http'];

    /**
     * @ngdoc service
     * @name  Dashboard.service:Feature
     *
     * @description
     *   Enter a description!
     */
    function Feature($http) {
        var self = this,
            closedStatuses = ['Closed', 'Rejected', 'Duplicate', 'Resolved'];

        self.features = [];

        self.getFeatures = function (project) {
            var promise;

            promise = $http.get('/api/upstream/' + project + '/trackers')

            promise.then(function (response) {
                self.features = response.data;
                processFeatures(self.features);
            });

            return promise;
        };

        self.refresh = function (project) {
            self.refreshing = true;

            return $http.get('/api/upstream/' + project + '/trackers/update').then(function (response) {
                self.refreshing = false;
                self.getFeatures(project);
            });
        };

        function processFeatures(features) {
            angular.forEach(features, function (feature) {
                addReleases(feature);
                addCounts(feature);
                addStoryPoints(feature);
            });
        }

        function addReleases(feature) {
            feature.releases = {};

            angular.forEach(feature.related_issues, function (issue) {
                feature.releases[releaseName(issue)] = {open: 0, closed: 0, storyPoints: 0, storyPointsCompleted: 0, ungroomed: 0};
            });
        }

        function addCounts(feature) {
            angular.forEach(feature.related_issues, function (issue) {
                if (isClosed(issue)) {
                    feature.releases[releaseName(issue)]['closed'] += 1;
                } else {
                    feature.releases[releaseName(issue)]['open'] += 1;
                }
            });
        }

        function addStoryPoints(feature) {
            angular.forEach(feature.related_issues, function (issue) {
                if (issue.story_points) {
                    if (isClosed(issue)) {
                        feature.releases[releaseName(issue)].storyPointsCompleted += issue.story_points;
                    } else {
                        feature.releases[releaseName(issue)].storyPoints += issue.story_points;
                    }
                } else {
                    feature.releases[releaseName(issue)].ungroomed += 1;
                }
            });
        }

        function isClosed(issue) {
            if (issue['status']) {
                return closedStatuses.indexOf(issue['status'].name) > -1;
            } else {
                return false;
            }
        }

        function releaseName(issue) {
            var release;

            if (issue.release) {
                release = issue.release.release.name.split('Katello ')[1];
            } else {
                release = 'No Release';
            }


            return release;
        }
    }

})();
