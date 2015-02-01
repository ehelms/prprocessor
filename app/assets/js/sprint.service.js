(function () {
    'use strict';

    angular
        .module('Dashboard')
        .service('Sprint', Sprint)

    Sprint.$inject = ['$http'];

    /**
     * @ngdoc service
     * @name  Dashboard.service:Sprint
     *
     * @description
     *   Enter a description!
     */
    function Sprint($http) {
        var self = this,
            closedStatuses = ['Closed', 'Rejected', 'Duplicate', 'Resolved'];

        self.issues = [];
        self.sprints = [];
        self.stats = {
            closed: {bugs: 0, features: 0, refactor: 0, points: 0},
            open: {bugs: 0, features: 0, refactor: 0, points: 0}
        };

        self.resetStats = function () {
            self.stats['closed']['bugs'] = 0;
            self.stats['closed']['features'] = 0;
            self.stats['closed']['refactor'] = 0;
            self.stats['closed']['points'] = 0;
            self.stats['closed']['ungroomed'] = 0;
            self.stats['open']['bugs'] = 0;
            self.stats['open']['features'] = 0;
            self.stats['open']['refactor'] = 0;
            self.stats['open']['points'] = 0;
            self.stats['open']['ungroomed'] = 0;
        };

        self.getSprints = function () {
            return $http.get('/api/upstream/katello/versions').then(function (response) {
                self.sprints = response.data;
            });
        };

        self.getIssues = function (id) {
            self.resetStats();

            return $http.get('/api/upstream/katello/versions/' + id + '/issues').then(function (response) {
                self.issues = response.data;
                self.processIssues(self.issues);
            });
        };

        self.refresh = function () {
            self.refreshing = true;

            return $http.get('/api/upstream/katello/versions/update').then(function (response) {
                self.getSprints().then(function () {
                    self.refreshing = false;
                });
            });
        };

        self.refreshIssues = function (id) {
            self.refreshing = true;

            return $http.get('/api/upstream/katello/versions/' + id + '/issues/update').then(function (response) {
                self.getIssues(id).then(function () {
                    self.refreshing = false;
                });
            });

        };

        self.processIssues = function (issues) {

            if (issues.issues !== undefined) {
                issues = issues.issues;
            }

            angular.forEach(issues, function (issue) {
                if (issue.tracker) {
                    if (closed(issue)) {
                        if (issue.tracker.name === "Bug") {
                            self.stats.closed.bugs += 1;
                        } else if (issue.tracker.name === "Feature") {
                            self.stats.closed.features += 1;

                            if (issue['story_points'] === null) {
                                self.stats.closed.ungroomed += 1;
                            }
                        } else if (issue.tracker.name === "Refactor") {
                            self.stats.closed.refactor += 1;
                        }
                        self.stats.closed.points += (parseInt(issue['story_points'], 10) || 0);
                    } else {
                        if (issue.tracker.name === "Bug") {
                            self.stats.open.bugs += 1;
                        } else if (issue.tracker.name === "Feature") {
                            self.stats.open.features += 1;

                            if (issue['story_points'] === null) {
                                self.stats.closed.ungroomed += 1;
                            }
                        } else if (issue.tracker.name === "Refactor") {
                            self.stats.open.refactor += 1;
                        }
                        self.stats.open.points += issue['story_points'];
                    }
                }
            });

        };

        function closed(issue) {
            if (issue['status']) {
                return closedStatuses.indexOf(issue['status'].name) > -1;
            } else {
                return false;
            }
        }

        self.openIssues = function () {
            var condition;

            condition = function (issue) {
                if (issue['status']) {
                    return closedStatuses.indexOf(issue['status'].name) === -1;
                } else {
                    return false;
                }
            };

            return filterIssues(self.issues, condition);
        };

        self.closedIssues = function () {
            var condition;

            condition = function (issue) {
                return closedStatuses.indexOf(issue['status'].name) > -1;
            };

            return filterIssues(self.issues, condition);
        };

        self.closedStoryPoints = function () {
            var issues = self.closedIssues(),
                points = 0;

            angular.forEach(issues, function (issue) {
                if (issue['story_points']) {
                    points = points + issue['story_points'];
                }
            });

            return points;
        };

        self.openStoryPoints = function () {
            var issues = self.openIssues(),
                points = 0;

            angular.forEach(issues, function (issue) {
                if (issue['story_points']) {
                    points = points + issue['story_points'];
                }
            });

            return points;
        };

        function filterIssues(issues, condition) {
            var selected = [];

            angular.forEach(issues, function (issue) {
                if (condition.call(self, issue)) {
                    selected.push(issue);
                }
            });

            return selected;
        };
    };

})();
