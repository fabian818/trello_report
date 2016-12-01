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
        $scope.lists = [];
        $scope.memberSelected = '';
        $scope.listSelected = '';
        $scope.token = '';
        loginTrello();

        $scope.getOrganizations = function(){
            refreshScopes();
            refreshData();
            TrelloService.getOrganizations($scope.token).then(function(organizations){
                $scope.boards = [];
                console.log('organizations')
                console.log(organizations.data);
                $scope.organizations = organizations.data;
            });
        }

        $scope.getBoards = function(organizationId){
            refreshScopes();
            TrelloService.getBoards($scope.token, organizationId).then(function(boards){
                console.log(boards.data.filter(function(n){return n.idOrganization === organizationId}));
                $scope.boards = boards.data.filter(function(n){return n.idOrganization === organizationId});
            });

            TrelloService.getMembers($scope.token, organizationId).then(function(members){
                console.log(members.data);
                $scope.members = members.data;
            });
        }

        $scope.getAllBoards = function(){
            refreshScopes();
            refreshData();
            TrelloService.getAllBoards($scope.token).then(function(boards){
                console.log(boards.data);
                $scope.boards = boards.data;
            });
        }

        $scope.getCards = function(boardId){
            refreshScopes();
            TrelloService.getCards($scope.token, boardId).then(function(data){
                console.log(data.data);
                $scope.cards = data.data;
                $scope.cardsHelp = data.data;
            });

            TrelloService.getLists($scope.token, boardId).then(function(lists){
                console.log(lists.data);
                $scope.lists = lists.data;
            });

            TrelloService.getBoardMembers($scope.token, boardId).then(function(members){
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
            $scope.organizations = [];
            $scope.boards = [];
            $scope.cards = [];
            $scope.lists = [];
            $scope.members = []
            $scope.cardsHelp = [];
        }

        function loginTrello(){
            Trello.authorize({
                type: 'popup',
                name: 'trello-report',
                scope: {
                    read: 'true',
                    write: 'true' },
                    expiration: 'never',
                    success: function(){
                        console.log('Usuario autenticado');
                        $scope.token = Trello.token();
                    },
                    error: function(){
                        console.log('Usuario falló');
                    }
                });
        }
    }]);
})();
