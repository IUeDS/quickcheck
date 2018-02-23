angular
    .module('manageService', [])
    .factory('Manage', ManageService);

ManageService.$inject = ['$http', 'HttpService'];

function ManageService($http, HttpService) {
    var service = {
        autoGrade: autoGrade,
        createRelease: createRelease,
        getAttemptsAndResponses: getAttemptsAndResponses,
        getAttemptsForStudent: getAttemptsForStudent,
        getAttemptSubmissions: getAttemptSubmissions,
        getOverview: getOverview,
        getReleases: getReleases,
        getResponseAnalytics: getResponseAnalytics,
        getStudentAnalytics: getStudentAnalytics,
        getStudentsByContext: getStudentsByContext,
        getStudentAttempts: getStudentAttempts,
        getStudentResponses: getStudentResponses,
        getStudentSubmission: getStudentSubmission,
        getUsersInCourse: getUsersInCourse,
        rollbackRelease: rollbackRelease,
        submitGrade: submitGrade
    };

    return service;

    function autoGrade(gradeData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'attempts/autograde',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
            data: $.param(gradeData)
            //no timeout, this could take a while
        });
    }

    function createRelease(releaseData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'release',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(releaseData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getAttemptsAndResponses(assessmentId, contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId + '/attempts/' + contextId,
            timeout: HttpService.getCrazyLongTimeout()
        });
    }

    function getAttemptsForStudent(contextId, studentId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'attempts/' + contextId + '/student/' + studentId,
            timeout: HttpService.getLongTimeout()
        });
    }

    function getAttemptSubmissions(assessmentId, contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId + '/attempts/' + contextId + '/submissions',
            timeout: HttpService.getCrazyLongTimeout()
        });
    }

    function getOverview(contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'attempts/' + contextId,
            timeout: HttpService.getLongTimeout()
        });
    }

    function getReleases(contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'release/' + contextId,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getResponseAnalytics(assessmentId, contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'responses/analytics/assessment/' + assessmentId + '/context/' + contextId,
            timeout: HttpService.getCrazyLongTimeout()
        });
    }

    //get students from Quick Check data, by context ID
    function getStudentsByContext(contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'students/context/' + contextId,
            timeout: HttpService.getLongTimeout()
        });
    }

    function getStudentAnalytics(contextId, studentId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'analytics/context/' + contextId + '/student/' + studentId,
            timeout: HttpService.getLongTimeout()
        });
    }

    function getStudentAttempts(assessmentId, contextId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId + '/attempt/' + contextId,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getStudentResponses(attemptId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'attempt/' + attemptId + '/responses',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getStudentSubmission(assessmentId, contextId, studentId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'assessment/' + assessmentId + '/attempts/' + contextId + '/submission/' + studentId,
            timeout: HttpService.getLongTimeout()
        });
    }

    //get users in the Canvas course, using the Canvas API
    function getUsersInCourse(courseId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'users/course/' + courseId,
            timeout: HttpService.getLongTimeout()
        });
    }

    function rollbackRelease(releaseId) {
        return $http({
            method: 'DELETE',
            url: HttpService.getApiRoot() + 'release/' + releaseId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function submitGrade(gradeData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'attempts/gradepassback',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(gradeData),
            timeout: HttpService.getLongTimeout()
        });
    }
}