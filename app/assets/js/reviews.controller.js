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

        self.repo = 'smart-proxy';

        Review.reviews(self.repo).then(function (reviews) {
            self.reviews = reviews.data[self.repo];
        });
    };

})();
