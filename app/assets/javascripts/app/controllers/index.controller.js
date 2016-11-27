(function () {
    'use strict';

    angular.module('myApp').controller('IndexController', ['$scope', 'TrelloService', function ($scope, TrelloService) {
        $scope.ideas = []
        $scope.ranking_ideas = []
        $scope.new_idea = {
            title: '',
            solution: ''
        }
        $scope.memberId = '';
        Trello.authorize({
            type: 'popup',
            name: 'wsnteam',
            scope: {
                read: 'true',
                write: 'true' },
                expiration: 'never',
                success: function(){
                    console.log('Usuario autenticado');
                },
                error: function(){
                    console.log('Usuario falló');
                }
            });
        $scope.boards = [];

        $scope.getBoards = function(){
            // console.log(Trello.organizations())
            
            TrelloService.getOrganizations(Trello.token()).then(function(data){
                console.log(data.data[1].idBoards);
                //$scope.memberId = data.data.id;
                data.data[1].idBoards.forEach(function(element){
                    console.log(element);
                })
            });
        }

        $scope.createBoard = function(){
            LoadingService.showHide();
            console.log('token user');
            console.log(Trello.token());
            $http({
                method: 'POST',
                // /1/members/[idMember or username]/boards
                url: 'https://api.trello.com/1/boards',
                data: {
                    ame: $scope.idea.title,
                    key: '28d1e5f62a4049c216bee203b0fcd1c2',
                    token: Trello.token()
                },
                headers: {}
            }).then(function successCallback(response) {
                IdeaService.set_board($stateParams.idea_id, response.data.url, response.data.id).then(function(data){

                });
            }, function errorCallback(response) {

                LoadingService.showHide();
            });

        }
    }]);
})();
