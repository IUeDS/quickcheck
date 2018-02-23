app.component('qcMultipleCorrect', {
    controller: MultipleCorrectController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('multipleCorrectTemplate.html');
    }]
});

MultipleCorrectController.$inject = ['Utilities', '$sce'];

function MultipleCorrectController(Utilities, $sce) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onChanges = $onChanges;
    vm.onAnswerSelected = onAnswerSelected;
    vm.trustHtml = trustHtml;

    function $onChanges(changesObj) {
        if (changesObj.currentQuestion) {
            vm.utils.formatMath();
            vm.trustHtml();
        }

        vm.utils.setLtiHeight();
    }

    function onAnswerSelected(option) {
        var studentAnswer = {'mcorrect_answer_ids': []},
            answerComplete = false;

        vm.currentQuestion.options.forEach(function(answerOption) {
            if (answerOption.selected) {
                studentAnswer.mcorrect_answer_ids.push(answerOption.id);
            }
        });

        if (studentAnswer.mcorrect_answer_ids.length) {
            answerComplete = true;
        }

        vm.onAnswerSelection({
            $event: {
                answerComplete: answerComplete,
                studentAnswer: studentAnswer
            }
        });
    }

    function trustHtml() {
        vm.currentQuestion.options.forEach(function(answerOption) {
            answerOption.answer_text = $sce.trustAsHtml(answerOption.answer_text);
        });
    }
}