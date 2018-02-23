angular
    .module('assessmentService', [])
    .factory('Assessment', AssessmentService);

AssessmentService.$inject = ['$http', 'HttpService'];

function AssessmentService($http, HttpService) {
    var service = {
        getQuestions: getQuestions,
        gradePassback: gradePassback,
        initAttempt: initAttempt,
        submitQuestion: submitQuestion
    };

    return service;

    function getQuestions(assessmentId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId + '/questions',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function gradePassback(attemptId) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'grade/passback',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param({'attemptId': attemptId}),
            timeout: HttpService.getLongTimeout()
        });
    }

    function initAttempt(assessmentId, isPreview) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'attempt/' + assessmentId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param({'preview': isPreview}),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function submitQuestion(questionId, submission) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'question/' + questionId + '/submit',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
            data: $.param(submission),
            timeout: HttpService.getMediumTimeout()
        });
    }
}