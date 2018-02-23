app.component('qcCustomFeedback', {
    controller: CustomFeedbackController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        question: '<qcQuestion'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('customFeedbackTemplate.html');
    }]
});

CustomFeedbackController.$inject = ['EditAssessmentConfig', 'Utilities'];

function CustomFeedbackController(EditAssessmentConfig, Utilities) {
    var vm = this;

    vm.isRichContentToggled = false;
    vm.perResponseFeedback = false;
    vm.tinymceOptions = EditAssessmentConfig.getTinyMceConfig();
    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.isCorrect = isCorrect;
    vm.isFeedbackPresent = isFeedbackPresent;
    vm.isPerResponseFeedbackAdded = isPerResponseFeedbackAdded;
    vm.isPerResponseFeedbackAvailable = isPerResponseFeedbackAvailable;
    vm.onEdited = onEdited;
    vm.onRichContentToggle = onRichContentToggle;
    vm.toggleCustomFeedback = toggleCustomFeedback;
    vm.toggleQuestionLevelFeedback = toggleQuestionLevelFeedback;
    vm.toggleOptionFeedback = toggleOptionFeedback;

    function $onInit() {
        vm.isPerResponseFeedbackAdded();
        if (!vm.question.question_feedback) { //for a new question
            vm.question.question_feedback = [];
        }
    }

    function isCorrect(option) {
        if (option.correct == 'true') {
            return true;
        }

        return false;
    }

    function isFeedbackPresent() {
        if (vm.question.question_feedback.length || vm.perResponseFeedback) {
            return true;
        }

        return false;
    }

    function isPerResponseFeedbackAdded() {
        vm.perResponseFeedback = false;

        //if a new question, might not have any options yet, so prevent an error being thrown
        if (!vm.question.options) {
            return;
        }

        if (!vm.question.options.length) {
            return;
        }

        //all options must have feedback added
        if (vm.question.options[0].mc_option_feedback) {
            vm.perResponseFeedback = true;
            vm.utils.setLtiHeight();
        }
    }

    function isPerResponseFeedbackAvailable() {
        var questionType = vm.question.question_type;

        if (questionType === 'multiple_choice' || questionType === 'multiple_correct') {
            return true;
        }

        return false;
    }

    function onEdited() {
        vm.onQuestionEdited({
            $event: {
                question: vm.question
            }
        });
    }

    function onRichContentToggle($event) {
        vm.isRichContentToggled = $event.isToggled;
    }

    function toggleCustomFeedback() {
        //if custom feedback has been added and needs to be removed
        if (vm.perResponseFeedback) {
            vm.toggleOptionFeedback();
        }
        //in all cases, toggle the question-level
        // --> if we remove per response feedback above, it automatically adds question-level back in,
        //     as a default, so we need to remove it to clear all custom feedback.
        // --> if the user is clicking the button add custom feedback, then add the default of question-level
        vm.toggleQuestionLevelFeedback();
    }

    function toggleQuestionLevelFeedback() {
        if (vm.question.question_feedback.length) { //remove if present
            vm.question.question_feedback = [];
        }
        else { //or add if not present
            //add correct/incorrect feedback by default
            vm.question.question_feedback = [
                {
                    'question_id' : vm.question.id,
                    'feedback_text' : '',
                    'correct': 'true'
                },
                {
                    'question_id' : vm.question.id,
                    'feedback_text' : '',
                    'correct': 'false'
                }
            ];
        }
        vm.onEdited();
        vm.utils.setLtiHeight();
    }

    function toggleOptionFeedback() {
        if (vm.perResponseFeedback) { //delete
            vm.perResponseFeedback = false;
            vm.question.options.forEach(function(option) {
                delete option.mc_option_feedback;
            });
        }
        else { //add
            vm.perResponseFeedback = true;
            vm.question.options.forEach(function(option) {
                option.mc_option_feedback = {
                    'mc_answer_id' : option.id,
                    'feedback_text': ''
                };
            });
        }
        //re-add or remove question-level correct/incorrect feedback, to prevent redundancies
        vm.toggleQuestionLevelFeedback();
    }
}