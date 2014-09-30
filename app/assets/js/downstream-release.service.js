(function () {
    'use strict';

    angular
        .module('Dashboard')
        .service('DownstreamRelease', DownstreamRelease)

    DownstreamRelease.$inject = ['$http'];

    /**
     * @ngdoc service
     * @name  Dashboard.service:DownstreamRelease
     *
     * @description
     *   Enter a description!
     */
    function DownstreamRelease($http) {
        var self = this;

        self.openIssues = function (release, params) {
            var url = '/downstream/release/' + release;

            return $http.get(url, {params: params});
        };

        self.closedIssues = function (release, params) {
            var url = '/downstream/release/' + release;

            params['status'] = 'closed';

            return $http.get(url, {params: params});
        };

    };

})();
