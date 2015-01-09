(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('SprintController', SprintController)

    SprintController.$inject = ['Sprint', '$stateParams'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:SprintController
     *
     * @description
     *   Enter a description!
     */
    function SprintController(Sprint, $stateParams) {
        var self = this;

        self.sprint = Sprint;
        self.stats = Sprint.stats;

        Sprint.getIssues($stateParams.sprintId);
    };

})();
