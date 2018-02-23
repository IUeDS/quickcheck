angular
    .module('userService', [])
    .factory('User', UserService);

UserService.$inject = ['$http', 'HttpService'];

function UserService($http, HttpService) {
    var service = {
        addAdmin: addAdmin,
        getUser: getUser,
        getUserAndPermissions: getUserAndPermissions,
        joinPublicCollection: joinPublicCollection,
        optOutPublicCollection: optOutPublicCollection,
        validateUser: validateUser
    };

    return service;

    function addAdmin(user) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'user/addAdmin',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(user),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    //to determine admin-specific UI options
    function getUser() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'user',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getUserAndPermissions(collectionId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'user/collection/' + collectionId,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function joinPublicCollection(collectionId, user) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'publicmembership/collection/' + collectionId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(user),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function optOutPublicCollection(collectionId, user) {
        return $http({
            method: 'DELETE',
            url: HttpService.getApiRoot() + 'publicmembership/collection/' + collectionId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(user),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    //validate user through LDAP when inviting a user
    function validateUser(user) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'user/validate',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(user),
            timeout: HttpService.getDefaultTimeout()
        });
    }
}