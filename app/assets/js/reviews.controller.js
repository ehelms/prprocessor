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

        self.repositories = [];
        self.selectedRepository = {};
        self.selectedRepositories = [];

        Review.fetchReviews().then(function () {
            self.reviews = Review.reviews;
            self.repositories = Review.repositories;
            self.refreshDate = Review.refreshDate;
        });

        self.refresh = function () {
            return Review.refresh();
        };

        self.enableFilters = function () {
            this.showFilters = !self.showFilters;
        };

        self.repositorySelected = function (repository) {
            self.selectedRepositories.push(repository);
            self.repositories.splice(self.repositories.indexOf(repository), 1);
            self.selectedRepository = {};
        };

        self.removeRepository = function (repository) {
            self.repositories.push(repository);
            self.selectedRepositories.splice(self.selectedRepositories.indexOf(repository), 1);
            self.selectedRepository = {};
        };

        self.filterByRepository = function (review) {
            var show;

            if (self.selectedRepositories.length === 0) {
                show = true;
            } else {
                show = self.selectedRepositories.indexOf(review.repo) !== -1;
            }

            return show;
        };
    };

})();
