app.component('qcTextmatch', {
    controller: TextmatchController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('textmatchTemplate.html');
    }]
});

TextmatchController.$inject = ['Utilities'];

function TextmatchController(Utilities) {
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

        //ensure answer wasn't erased
        if (vm.answer) {
            answerComplete = true;
        }

        vm.onAnswerSelection({
            $event: {
                answerComplete: answerComplete,
                studentAnswer: {'textmatch_answer': vm.answer}
            }
        });
    }
}