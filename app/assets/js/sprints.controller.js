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
    };

})();
