app.component('qcEditTextmatch', {
    controller: EditTextmatchController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        onSavedOptionDeleted: '&qcOnSavedOptionDeleted',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editTextmatchTemplate.html');
    }]
});

EditTextmatchController.$inject = ['Utilities'];

function EditTextmatchController(Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.addOption = addOption;
    vm.deleteOption = deleteOption;
    vm.isInvalid = isInvalid;
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
            'question_id': vm.question.id,
            'textmatch_answer_text': ''
        });

        vm.onEdited();
        vm.utils.focusToElement('#textmatch-answer-' + vm.question.id + '-' + tempId);
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

    function isInvalid() {
        if (vm.question.options.length) {
            return false;
        }
        else {
            return 'No answer options were added to this question.';
        }
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