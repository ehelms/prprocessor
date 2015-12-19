(function () {
    'use strict';

    angular
        .module('Dashboard')
        .service('Review', Review)

    Review.$inject = ['$http'];

    /**
     * @ngdoc service
     * @name  Dashboard.service:Review
     *
     * @description
     *   Enter a description!
     */
    function Review($http) {
        var self = this;

        self.reviews = [];
        self.repositories = {};

        self.fetchReviews = function (params) {
            var url = '/api/reviews',
                promise;

            promise = $http.get(url, {params: params});

            promise.then(function (response) {
                self.reviews = response.data;
                self.repositories = extractRepositories(self.reviews);
                self.refreshDate = self.reviews[0]['refreshed_on'];
            });

            return promise;
        };

        self.refresh = function (repo) {
            self.refreshing = true;

            return $http.get('/api/reviews/update').then(function (response) {
                self.reviews(repo).then(function () {
                    self.refreshing = false;
                });
            });
        };

        function extractRepositories(reviews) {
            var repositories = [];

            angular.forEach(reviews, function (review) {
                if (repositories.indexOf(review.repo) === -1) {
                    repositories.push(review.repo);
                }
            });

            return repositories;
        }
    };

})();
