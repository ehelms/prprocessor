(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('SprintsController', SprintsController)

    SprintsController.$inject = ['Sprint'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:SprintsController
     *
     * @description
     *   Enter a description!
     */
    function SprintsController(Sprint) {
        var self = this;

        self.sprint = Sprint;

        Sprint.getSprints();

        self.refresh = function () {
            return self.sprint.refresh();
        };

        self.ungroomed = function () {
            var total = 0;

            angular.forEach(self.sprint.sprints, function (sprint) {
                total += sprint.stats.closed.ungroomed + sprint.stats.open.ungroomed;
            });

            return total;
        };

        self.features = function () {
            var total = 0;

            angular.forEach(self.sprint.sprints, function (sprint) {
                total += sprint.stats.closed.features + sprint.stats.open.features;
            });

            return total;
        };

        self.bugs = function () {
            var total = 0;

            angular.forEach(self.sprint.sprints, function (sprint) {
                total += sprint.stats.closed.bugs + sprint.stats.open.bugs;
            });

            return total;
        };
    };

})();
