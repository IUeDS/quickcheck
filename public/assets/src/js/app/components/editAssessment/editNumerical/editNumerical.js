app.component('qcEditNumerical', {
    controller: EditNumericalController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        onSavedOptionDeleted: '&qcOnSavedOptionDeleted',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editNumericalTemplate.html');
    }]
});

EditNumericalController.$inject = ['Utilities'];

function EditNumericalController(Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.addOption = addOption;
    vm.deleteOption = deleteOption;
    vm.isExactAnswer = isExactAnswer;
    vm.isInvalid = isInvalid;
    vm.isRangeAnswer = isRangeAnswer;
    vm.onEdited = onEdited;
    vm.onSubComponentEdited = onSubComponentEdited;

    function $onInit() {
        //when a new question is added, want to ensure validation is run immediately;
        //prevent a user from saving a new question without data added in.
        if (vm.isInvalid()) {
            vm.onEdited();
        }
    }

    function addOption() {
        var tempId = (vm.question.options.length + 1).toString() + '-temp';

        vm.question.options.push({
            'id': tempId,
            'question_id': vm.question.Id,
            'answer_type': 'exact',
            'numerical_answer': '',
            'margin_of_error': 0,
            'range_min': null,
            'range_max': null
        });

        vm.onEdited();
        vm.utils.focusToElement('#numerical-answer-' + vm.question.id + '-' + tempId);
    }

    function deleteOption($event) {
        var option = $event.option,
            index = $event.index;

        //parent question component keeps track of all deleted options to pass to back-end
        if (option.id.toString().indexOf('temp') === -1) {
            vm.onSavedOptionDeleted({$event: { option: option }});
        }

        vm.question.options.splice(index, 1);
        vm.onEdited();
    }

    function isExactAnswer(option) {
        if (option.answer_type === 'exact') {
            return true;
        }

        return false;
    }

    function isInvalid() {
        if (vm.question.options.length) {
            return false;
        }
        else {
            return 'No answer options were added to this question.';
        }
    }

    function isRangeAnswer(option) {
        if (option.answer_type === 'range') {
            return true;
        }

        return false;
    }

    function onEdited() {
        vm.question.validationError = vm.isInvalid();
        vm.onQuestionEdited({
            $event: {
                question: vm.question
            }
        });
    }

    function onSubComponentEdited($event) {
        vm.question = $event.question;
        vm.onEdited();
    }
}