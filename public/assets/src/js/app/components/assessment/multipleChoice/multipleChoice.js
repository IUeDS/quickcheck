app.component('qcMultipleChoice', {
    controller: MultipleChoiceController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('multipleChoiceTemplate.html');
    }]
});

MultipleChoiceController.$inject = ['Utilities', '$sce'];

function MultipleChoiceController(Utilities, $sce) {
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
        //pretty straight-forward with multiple choice--if any option selected,
        //then fire up to parent component that answer is complete
        vm.onAnswerSelection({
            $event: {
                answerComplete: true,
                studentAnswer: {'mc_answer_id': option.id}
            }
        });
    }

    function trustHtml() {
        vm.currentQuestion.options.forEach(function(answerOption) {
            answerOption.answer_text = $sce.trustAsHtml(answerOption.answer_text);
        });
    }
}