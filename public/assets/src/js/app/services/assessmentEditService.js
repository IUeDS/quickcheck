angular
    .module('assessmentEditService', [])
    .factory('AssessmentEdit', AssessmentEditService);

AssessmentEditService.$inject = ['$http', 'HttpService'];

function AssessmentEditService($http, HttpService) {
    var service = {
        deleteAssessment: deleteAssessment,
        getAssessment: getAssessment,
        saveAssessment: saveAssessment,
        updateAssessment: updateAssessment
    };

    return service;

    function deleteAssessment(assessmentId) {
        return $http({
            method: 'DELETE',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getAssessment(assessmentId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function saveAssessment(assessmentData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'assessment',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(assessmentData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function updateAssessment(assessmentId, assessmentData) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(assessmentData),
            timeout: HttpService.getDefaultTimeout()
        });
    }
}