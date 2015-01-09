(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('FeaturesController', FeaturesController)

    FeaturesController.$inject = ['Feature', '$stateParams'];

    /**
     * @ngdoc controller
     * @name  Dashboard.controller:FeaturesController
     *
     * @description
     *   Enter a description!
     */
    function FeaturesController(Feature, $stateParams) {
        var self = this;

        self.feature = Feature;

        self.releases = [2.0, 2.1, 2.2];

        Feature.getFeatures($stateParams.project);

        self.getType = function (feature, release) {
            var type = 'danger',
                completion = self.completion(feature, release);

            if (completion < 33) {
                type = 'danger';
            } else if (completion < 66) {
                type = 'warning';
            } else if (completion < 100) {
                type = 'info';
            } else {
                type = 'success';
            }

            return type;
        };

        self.completion = function (feature, release) {
            return (feature.releases[release].closed / (feature.releases[release].closed + feature.releases[release].open)) * 100;
        };

        self.releasesCount = function (feature) {
            return Object.keys(feature.releases).length;
        };

    };

})();
