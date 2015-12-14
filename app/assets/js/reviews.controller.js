(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('ReviewsController', ReviewsController)

    ReviewsController.$inject = ['Review'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:ReviewsController
     *
     * @description
     *   Enter a description!
     */
    function ReviewsController(Review, $stateParams) {
        var self = this;

        Review.reviews().then(function (reviews) {
            self.reviews = reviews.data;
        });

        self.refresh = function () {
            return Review.refresh();
        };
    };

})();
