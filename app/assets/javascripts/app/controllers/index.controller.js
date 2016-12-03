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
        // scope arrays
        $scope.organizations = [];
        $scope.boards = [];
        $scope.cards = [];
        $scope.members = []
        $scope.cardsHelp = [];
        $scope.lists = [];

        //scope selecteds
        $scope.organizationSelected = '';
        $scope.boardSelected = '';
        $scope.memberSelected = '';
        $scope.listSelected = '';
        $scope.token = '';
        loginTrello();

        $scope.scroll = function($event){
            window.scrollTo(window.pageXOffset, $event.currentTarget.scrollHeight - 100);
        }

        $scope.toggle = function($event){
            var ul = $($event.currentTarget).parent().parent().find('ul');
            var span = $($event.currentTarget).find('span');
            var i = $($event.currentTarget).find('i');
            console.log(ul.css('display'))
            if (ul.css('display') === 'none') {
                ul.css('display', 'flex');
                span.html('Hide');
                i.removeClass('fa-chevron-down');
                i.addClass('fa-chevron-up');
            }
            else{
                ul.css('display', 'none');
                span.html('Show');
                i.removeClass('fa-chevron-up');
                i.addClass('fa-chevron-down');
            }            
        }

        $scope.loginTrello = function(){
            loginTrello();
        }

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

        $scope.getBoards = function(organization){
            refreshScopes();
            $scope.organizationSelected = organization;
            TrelloService.getBoards($scope.token, organization.id).then(function(boards){
                console.log(boards.data.filter(function(n){return n.idOrganization === organization.id}));
                $scope.boards = boards.data.filter(function(n){return n.idOrganization === organization.id});
            });

            TrelloService.getMembers($scope.token, organization.id).then(function(members){
                console.log(members.data);
                $scope.members = members.data;
            });
        }

        $scope.getAllBoards = function(){
            refreshScopes();
            refreshData();
            TrelloService.getAllBoards($scope.token).then(function(boards){
                console.log(boards.data);
                $scope.boards = boards.data.filter(function(n){return n.closed === false});
            });
        }

        $scope.getCards = function(board){
            refreshScopes();
            $scope.boardSelected = board;
            TrelloService.getCards($scope.token, board.id).then(function(data){
                console.log(data.data);
                $scope.cards = data.data;
                $scope.cardsHelp = data.data;
            });

            TrelloService.getLists($scope.token, board.id).then(function(lists){
                console.log(lists.data);
                $scope.lists = lists.data;
            });

            TrelloService.getBoardMembers($scope.token, board.id).then(function(members){
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
                    write: 'true' 
                },
                expiration: 'never',
                success: function(){
                    console.log('Usuario autenticado');
                    $scope.token = Trello.token();
                    // thank's to GiancarlosIO
                    if(!$scope.$$phase) {
                        $scope.$apply()
                    }
                    
                },
                error: function(){
                    console.log('Usuario falló');
                }
            });
        }
    }]);
})();
