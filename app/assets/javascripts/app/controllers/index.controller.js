(function () {
    'use strict';

    angular.module('myApp').controller('IndexController', ['$scope', function ($scope) {
        $scope.ideas = []
        $scope.ranking_ideas = []
        $scope.new_idea = {
            title: '',
            solution: ''
        }
    }]);
})();
