app.component('qcQuestionAnalytics', {
    controller: QuestionAnalyticsController,
    controllerAs: 'vm',
    bindings: {
        question: '<qcQuestion'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('questionAnalyticsTemplate.html');
    }]
});

QuestionAnalyticsController.$inject = ['$sce', 'Utilities'];

function QuestionAnalyticsController($sce, Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.getOtherResponsesPercentage = getOtherResponsesPercentage;
    vm.toggleResponses = toggleResponses;

    function $onInit() {
        vm.correctPercentage = 0;
        vm.fullBarWidth = 500;
        vm.correctPercentage = vm.question.questionAnalytics.correctPercentage;
        vm.utils.formatMath(); //if equations present, format LaTeX
    }

    function getOtherResponsesPercentage(question) {
        var countOther = question.questionAnalytics.otherResponses.length,
            countAnswered = question.questionAnalytics.countAnswered;
        return Math.round(countOther / countAnswered * 100);
    }

    function toggleResponses(question) {
        if (question.responsesVisible) {
            question.responsesVisible = false;
        }
        else {
            question.responsesVisible = true;
        }
    }
}