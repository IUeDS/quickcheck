app.component('qcFeedbackModal', {
    controller: FeedbackModalController,
    controllerAs: 'vm',
    bindings: {
        feedback: '<qcFeedback',
        isCorrect: '<qcIsCorrect',
        isNextBtnDisabled: '<qcIsNextBtnDisabled',
        onNextQuestion: '&qcOnNextQuestion'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('feedbackModalTemplate.html');
    }]
});

function FeedbackModalController() {
    var vm = this;

    vm.nextQuestion = nextQuestion;

    function nextQuestion() {
        vm.onNextQuestion();
    }
}