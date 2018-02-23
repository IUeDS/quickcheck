app.component('qcEditMultipleCorrect', {
    controller: EditMultipleCorrectController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        onSavedOptionDeleted: '&qcOnSavedOptionDeleted',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editMultipleCorrectTemplate.html');
    }]
});

EditMultipleCorrectController.$inject = ['EditAssessmentConfig', 'Utilities'];

function EditMultipleCorrectController(EditAssessmentConfig, Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.addOption = addOption;
    vm.deleteOption = deleteOption;
    vm.isInvalid = isInvalid;
    vm.isRichContentToggled = false;
    vm.onEdited = onEdited;
    vm.onRichContentToggle = onRichContentToggle;
    vm.onSubComponentEdited = onSubComponentEdited;
    vm.tinymceOptions = EditAssessmentConfig.getTinyMceConfig();
    vm.toggleCorrect = toggleCorrect;

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
            'answer_text': '',
            'correct': 'false'
        });

        vm.onEdited();
        vm.utils.focusToElement('#mc-option-' + vm.question.id + '-' + tempId);
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
        var optionsAdded = false,
            correctAnswerFound = false;

        if (vm.question.options.length) {
            optionsAdded = true;
        }

        //check that a correct answer is marked
        vm.question.options.forEach(function(option) {
            if (option.correct == 'true') {
                correctAnswerFound = true;
            }
        });

        if (optionsAdded && correctAnswerFound) {
            return false;
        }

        if (!optionsAdded) {
            return 'No answer options were added to this question.';
        }

        if (!correctAnswerFound) {
            return 'A correct answer has not been marked.';
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

    function onRichContentToggle($event) {
        vm.isRichContentToggled = $event.isToggled;
    }

    function onSubComponentEdited($event) {
        vm.question = $event.question;
        vm.onEdited();
    }

    function toggleCorrect($event) {
        var option = $event.option;

        if (vm.readOnly) {
            return;
        }

        if (option.correct == 'false') {
            option.correct = 'true';
        }
        else {
            option.correct = 'false';
        }

        vm.onEdited();
    }
}