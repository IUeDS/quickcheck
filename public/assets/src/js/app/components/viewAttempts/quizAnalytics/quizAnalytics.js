app.component('qcQuizAnalytics', {
    controller: QuizAnalyticsController,
    controllerAs: 'vm',
    bindings: {
        assessment: '<qcAssessment',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('quizAnalyticsTemplate.html');
    }]
});

QuizAnalyticsController.$inject = ['Manage', 'Utilities'];

function QuizAnalyticsController(Manage, Utilities) {
    var vm = this;

    vm.analytics = null;

    vm.$onInit = $onInit;
    vm.getAnalytics = getAnalytics;
    vm.isCustom = isCustom;

    function $onInit() {
        vm.getAnalytics();
    }

    function getAnalytics() {
        vm.utils.loadingStarted();
        Manage.getResponseAnalytics(vm.assessment.id, vm.utils.contextId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.analytics = data.analytics;
                vm.numAttempts = vm.analytics.assessmentAnalytics.numAttempts;
                vm.medianScore = vm.analytics.assessmentAnalytics.medianScore;
                vm.avgAttempts = vm.analytics.assessmentAnalytics.avgAttempts;
                vm.avgTime = vm.analytics.assessmentAnalytics.avgTime;
                vm.questions = vm.analytics.questionAnalytics;
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function isCustom() {
        return vm.assessment.custom_activity_id;
    }
}