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

        self.reviews = function (repo, params) {
            var url = '/api/reviews/' + repo;

            return $http.get(url, {params: params});
        };
    };

})();
