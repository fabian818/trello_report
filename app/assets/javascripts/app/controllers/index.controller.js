(function () {
    'use strict';

    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    angular.module('myApp').controller('IndexController', ['$scope', 'TrelloService', function ($scope, TrelloService) {
        $scope.boards = [];
        $scope.cards = [];
        $scope.members = []
        $scope.cardsHelp = [];
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

            TrelloService.getOrganizations(Trello.token()).then(function(organizations){
                console.log(organizations.data);
                
                var idOrganization =  organizations.data[1].id;
                console.log(idOrganization);
                TrelloService.getBoards(Trello.token()).then(function(boards){
                    console.log(boards.data.filter(function(n){return n.idOrganization === idOrganization}));
                    $scope.boards = boards.data.filter(function(n){return n.idOrganization === idOrganization});
                });
                TrelloService.getMembers(Trello.token(), idOrganization).then(function(members){
                    console.log(members.data);
                    $scope.members = members.data;
                });
            });            
            
        }

        $scope.getCards = function(boardId){
            TrelloService.getCards(Trello.token(), boardId).then(function(data){
                console.log(data.data);
                $scope.cards = data.data;
                $scope.cardsHelp = data.data;
            });
        }

        $scope.setMemberCards = function(memberId){
            $scope.cards = $scope.cardsHelp;
            $scope.cards = $scope.cards.filter(function(n){
                return n.idMembers.includes(memberId);
            })
        }
    }]);
})();
