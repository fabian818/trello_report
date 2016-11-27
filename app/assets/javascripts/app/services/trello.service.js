(function () {
    'use strict';

    angular
    .module('myApp')
    .factory('TrelloService', TrelloService);

    TrelloService.$inject = ['$http', 'localStorageService'];
    function TrelloService($http, localStorageService) {
        var service = {};
        service.getBoards = getBoards;
        service.getOrganizations = getOrganizations;

        return service;

        function getBoards(token) {
            return $http.get('https://api.trello.com/1/members/me/boards', {
                params: {
                    token: token,                    
                    key: '28d1e5f62a4049c216bee203b0fcd1c2'
                }
            })
        }

        function getMember(token) {
            return $http.get('https://api.trello.com/1/members/me', {
                params: {
                    token: token,
                    key: '28d1e5f62a4049c216bee203b0fcd1c2'
                }
            })
        }

        function getOrganizations(token) {
            return $http.get('https://api.trello.com/1/members/me/organizations', {
                params: {
                    token: token,
                    key: '28d1e5f62a4049c216bee203b0fcd1c2'
                }
            })
        }

        function like(idea_id) {
            return $http.post('/api/likes/create', {
                idea_id: idea_id
            })
        }

        function share(idea_id) {
            return $http.post('/api/likes/share', {
                idea_id: idea_id
            })
        }

        function notifications() {
            return $http.get('/api/notifications/index')
        }

        function see(notification_id) {
            return $http.put('/api/notifications/see', {
                notification_id: notification_id
            })
        }

        function set_board(idea_id, board_url, board_id) {
            return $http.put('/api/ideas/set_board', {
                idea_id: idea_id,
                board_url: board_url,
                board_id: board_id
            })
        }

    }

})();