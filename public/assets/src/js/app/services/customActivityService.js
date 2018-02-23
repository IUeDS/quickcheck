angular
    .module('customActivityService', [])
    .factory('CustomActivity', CustomActivityService);

CustomActivityService.$inject = ['$http', 'HttpService'];

function CustomActivityService($http, HttpService) {
    var service = {
        createCustom: createCustom,
        deleteCustom: deleteCustom,
        getCustomActivities: getCustomActivities,
        updateCustom: updateCustom
    };

    return service;

    function getCustomActivities() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'customActivities',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function createCustom(customActivity) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'customActivity',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(customActivity),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function updateCustom(activityId, customActivity) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'customActivity/' + activityId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(customActivity),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function deleteCustom(activityId) {
        return $http({
            method: 'DELETE',
            url: HttpService.getApiRoot() + 'customActivity/' + activityId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            timeout: HttpService.getDefaultTimeout()
        });
    }
}