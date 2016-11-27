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
        $scope.organizations = [];
        $scope.boards = [];
        $scope.cards = [];
        $scope.members = []
        $scope.cardsHelp = [];
        $scope.memberSelected = '';
        $scope.listSelected = '';
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

        $scope.getOrganizations = function(){
            refreshScopes();
            refreshData();
            TrelloService.getOrganizations(Trello.token()).then(function(organizations){
                $scope.boards = [];
                console.log('organizations')
                console.log(organizations.data);
                $scope.organizations = organizations.data;
            });
        }

        $scope.getBoards = function(organizationId){
            refreshScopes();
            TrelloService.getBoards(Trello.token(), organizationId).then(function(boards){
                console.log(boards.data.filter(function(n){return n.idOrganization === organizationId}));
                $scope.boards = boards.data.filter(function(n){return n.idOrganization === organizationId});
            });

            TrelloService.getMembers(Trello.token(), organizationId).then(function(members){
                console.log(members.data);
                $scope.members = members.data;
            });
        }

        $scope.getBoards = function(){
            refreshScopes();
            refreshData();
            TrelloService.getAllBoards(Trello.token()).then(function(boards){
                console.log(boards.data);
                $scope.boards = boards.data;
            });
        }

        $scope.getCards = function(boardId){
            refreshScopes();
            TrelloService.getCards(Trello.token(), boardId).then(function(data){
                console.log(data.data);
                $scope.cards = data.data;
                $scope.cardsHelp = data.data;
            });

            TrelloService.getLists(Trello.token(), boardId).then(function(lists){
                console.log(lists.data);
                $scope.lists = lists.data;
            });

            TrelloService.getBoardMembers(Trello.token(), boardId).then(function(members){
                console.log(members.data);
                $scope.members = members.data;
            });
        }

        $scope.setMember = function(member){
            $scope.memberSelected = member;
            filterCards();
        }

        $scope.setList = function(list){
            $scope.listSelected = list;
            filterCards();
        }

        function filterCards(){
            $scope.cards = $scope.cardsHelp;
            if ($scope.memberSelected !== '') {                
                $scope.cards = $scope.cards.filter(function(n){
                    return n.idMembers.includes($scope.memberSelected.id);
                })
            }
            if ($scope.listSelected !== '') {                
                $scope.cards = $scope.cards.filter(function(n){
                    return n.idList.includes($scope.listSelected.id);
                })
            }
        }

        function refreshScopes(){
            $scope.memberSelected = '';
            $scope.listSelected = '';
        }

        function refreshData(){
            $scope.boards = '';
            $scope.members = '';
            $scope.lists = '';
        }
    }]);
})();
