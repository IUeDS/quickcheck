app.component('qcNumerical', {
    controller: NumericalController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('numericalTemplate.html');
    }]
});

NumericalController.$inject = ['Utilities'];

function NumericalController(Utilities) {
    var vm = this;

    vm.answer = null;
    vm.utils = new Utilities();

    vm.$onChanges = $onChanges;
    vm.onInput = onInput;

    function $onChanges(changesObj) {
        if (changesObj.currentQuestion) {
            vm.utils.formatMath();
            vm.answer = null; //reset answer for new question
        }

        vm.utils.setLtiHeight();
    }

    function onInput() {
        var answerComplete = false;

        //ensure answer wasn't erased, and make sure 0 can be an answer
        if (vm.answer || vm.answer === 0) {
            answerComplete = true;
        }

        vm.onAnswerSelection({
            $event: {
                answerComplete: answerComplete,
                studentAnswer: {'numerical_answer': vm.answer}
            }
        });
    }
}