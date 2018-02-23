app.component('qcToggleCorrectBtn', {
    controller: ToggleCorrectBtnController,
    controllerAs: 'vm',
    bindings: {
        index: '<qcIndex',
        onToggleCorrect: '&qcOnToggleCorrect',
        option: '<qcOption',
        question: '<qcQuestion'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('toggleCorrectBtnTemplate.html');
    }]
});

ToggleCorrectBtnController.$inject = ['EditAssessmentConfig'];

function ToggleCorrectBtnController(EditAssessmentConfig) {
    var vm = this;
    vm.questionTypes = EditAssessmentConfig.getQuestionTypes();

    vm.isCorrect = isCorrect;
    vm.isMultipleChoice = isMultipleChoice;
    vm.isMultipleCorrect = isMultipleCorrect;
    vm.toggleCorrect = toggleCorrect;

    function isCorrect() {
        if (vm.option.correct == 'true') {
            return true;
        }

        return false;
    }

    function isMultipleChoice() {
        if (vm.question.question_type === vm.questionTypes.multipleChoice.constantName) {
            return true;
        }

        return false;
    }

    function isMultipleCorrect() {
        if (vm.question.question_type === vm.questionTypes.multipleCorrect.constantName) {
            return true;
        }

        return false;
    }

    function toggleCorrect() {
        vm.onToggleCorrect({
            $event: {
                option: vm.option
            }
        });
    }
}