angular
    .module('httpService', [])
    .factory('HttpService', HttpService);

HttpService.$inject = ['$http', '$rootScope'];

function HttpService($http, $rootScope) {
    var timeoutLimits = {
        default: 5000,
        medium: 10000,
        long: 20000,
        crazyLong: 60000
    };
    var service = {
        getApiRoot: getApiRoot,
        getCrazyLongTimeout: getCrazyLongTimeout,
        getDefaultTimeout: getDefaultTimeout,
        getMediumTimeout: getMediumTimeout,
        getLongTimeout: getLongTimeout,
        getPageRoot: getPageRoot
    };

    return service;

    function getPageRoot() {
        return $rootScope.page_root;
    }

    function getApiRoot() {
        return $rootScope.page_root + '/api/';
    }

    function getDefaultTimeout() {
        return timeoutLimits.default;
    }

    function getMediumTimeout() {
        return timeoutLimits.medium;
    }

    function getLongTimeout() {
        return timeoutLimits.long;
    }

    function getCrazyLongTimeout() {
        return timeoutLimits.crazyLong;
    }
}