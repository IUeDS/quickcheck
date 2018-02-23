app.component('qcEditMultipleChoice', {
    controller: EditMultipleChoiceController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        onSavedOptionDeleted: '&qcOnSavedOptionDeleted',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editMultipleChoiceTemplate.html');
    }]
});

EditMultipleChoiceController.$inject = ['EditAssessmentConfig', 'Utilities'];

function EditMultipleChoiceController(EditAssessmentConfig, Utilities) {
    var vm = this;

    vm.defaultOptionCount = 4;
    vm.isRichContentToggled = false;
    vm.tinymceOptions = EditAssessmentConfig.getTinyMceConfig();
    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.addOption = addOption;
    vm.deleteOption = deleteOption;
    vm.initializeNewQuestion = initializeNewQuestion;
    vm.isInvalid = isInvalid;
    vm.isMultipleCorrect = isMultipleCorrect;
    vm.isNewQuestion = isNewQuestion;
    vm.onEdited = onEdited;
    vm.onRichContentToggle = onRichContentToggle;
    vm.onSubComponentEdited = onSubComponentEdited;
    vm.toggleCorrect = toggleCorrect;
    vm.toggleCorrectValue = toggleCorrectValue;
    vm.toggleMultipleCorrect = toggleMultipleCorrect;

    function toggleSettings() {
        vm.settingsVisible = !vm.settingsVisible;
    }

    function $onInit() {
        if (vm.isNewQuestion()) {
            vm.initializeNewQuestion();
        }
    }

    function addOption(noFocus) {
        var tempId = (vm.question.options.length + 1).toString() + '-temp';

        vm.question.options.push({
            'id': tempId,
            'question_id': vm.question.id,
            'answer_text': '',
            'correct': 'false'
        });

        vm.onEdited();

        if (noFocus) { //when initializing new question, don't steal focus
            return;
        }

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

    function initializeNewQuestion() {
        var noFocus = true; //don't hog focus from beginning of question

        //ensure we don't accidentally double-dip; can happen if reordering new question
        if (vm.question.options.length) {
            return;
        }

        for (i = 0; i < vm.defaultOptionCount; i++) {
            vm.addOption(noFocus);
        }
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

    function isMultipleCorrect() {
        if (vm.question.multiple_correct == 'true') {
            return true;
        }

        return false;
    }

    function isNewQuestion() {
        //if integer ID from database, not new
        if (typeof vm.question.id !== 'string') {
            return false;
        }

        if (vm.question.id.indexOf('temp') >= 0) {
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

    function onRichContentToggle($event) {
        vm.isRichContentToggled = $event.isToggled;
    }

    function onSubComponentEdited($event) {
        vm.question = $event.question;
        vm.onEdited();
    }

    function toggleCorrect($event) {
        //can't add ng-disabled since this isn't technically a button element
        if (vm.readOnly) {
            return false;
        }

        var option = $event.option; //retrieved from sub-component event

        //by default, only one correct answer for multiple choice; however, if the checkbox for
        //multiple_correct is checked, then although the question will appear as multiple choice,
        //students can get credit for several different answers (i.e., survey-style question)
        if (vm.isMultipleCorrect()) {
            vm.toggleCorrectValue(option);
        }
        else {
            //if a typical multiple choice question, ensure that only the option being clicked
            //is marked as correct, and all other options are marked as incorrect
            vm.question.options.forEach(function(thisOption) {
                if (thisOption.id !== option.id) {
                    thisOption.correct = 'false';
                }
                else {
                    thisOption.correct = 'true';
                }
            });
        }

        vm.onEdited();
    }

    function toggleCorrectValue(option) {
        if (option.correct == 'false') {
            option.correct = 'true';
        }
        else {
            option.correct = 'false';
        }
    }

    function toggleMultipleCorrect() {
        if (vm.question.multiple_correct == 'true') {
            vm.question.multiple_correct = 'false';
        }
        else {
            vm.question.multiple_correct = 'true';
        }

        vm.onEdited();
    }
}