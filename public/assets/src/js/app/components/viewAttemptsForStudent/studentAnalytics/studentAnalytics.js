app.component('qcStudentAnalytics', {
    controller: StudentAnalyticsController,
    controllerAs: 'vm',
    bindings: {
        studentId: '<qcStudentId',
        studentName: '<qcStudentName',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('studentAnalyticsTemplate.html');
    }]
});

StudentAnalyticsController.$inject = ['Manage'];

function StudentAnalyticsController(Manage) {
    var vm = this;

    vm.averageRetries = 0;
    vm.averageScore = 0;
    vm.averageTime = 0;
    vm.averageTimeBeforeDueDate = 0;
    vm.averageTimeAfterDueDate = 0;
    vm.averageTimeUntilDueDate = 0;
    vm.totalAttempts = 0;
    vm.totalQuestions = 0;
    vm.totalTime = 0;
    vm.totalTimeBeforeDueDate = 0;
    vm.totalTimeAfterDueDate = 0;

    vm.$onInit = $onInit;
    vm.getAnalytics = getAnalytics;

    function $onInit() {
        vm.getAnalytics();
    }

    function getAnalytics() {
        vm.utils.loadingStarted();
        Manage.getStudentAnalytics(vm.utils.contextId, vm.studentId).then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.totalAttempts = data.studentAnalytics.totalAttempts;
            vm.averageScore = data.studentAnalytics.averageScore;
            vm.totalQuestions = data.studentAnalytics.totalQuestions;
            vm.averageRetries = data.studentAnalytics.averageRetries;
            vm.totalTime = data.studentAnalytics.totalTime;
            vm.totalTimeBeforeDueDate = data.studentAnalytics.totalTimeBeforeDueDate;
            vm.totalTimeAfterDueDate = data.studentAnalytics.totalTimeAfterDueDate;
            vm.averageTime = data.studentAnalytics.averageTime;
            vm.averageTimeBeforeDueDate = data.studentAnalytics.averageTimeBeforeDueDate;
            vm.averageTimeAfterDueDate = data.studentAnalytics.averageTimeAfterDueDate;
            vm.averageTimeUntilDueDate = data.studentAnalytics.averageTimeUntilDueDate;
            vm.utils.loadingFinished();
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }
}