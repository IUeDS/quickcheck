angular
    .module('caliperForwarderService', [])
    .factory('CaliperForwarder', CaliperForwarderService);

CaliperForwarderService.$inject = ['$http', 'HttpService'];

function CaliperForwarderService($http, HttpService) {
    var service = {
        forwardEvent: forwardEvent
    };

    return service;

    function forwardEvent(sensorHost, eventData) {
        return $http({
            method: 'POST',
            url: sensorHost + '/api/events',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(eventData),
            timeout: HttpService.getDefaultTimeout()
        });
    }
}