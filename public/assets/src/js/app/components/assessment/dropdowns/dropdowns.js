app.component('qcDropdowns', {
    controller: DropdownsController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('dropdownsTemplate.html');
    }]
});

DropdownsController.$inject = ['Utilities', '$sce'];

function DropdownsController(Utilities, $sce) {
    var vm = this;

    vm.prompts = [];
    vm.selectableAnswers = [];
    vm.utils = new Utilities();

    vm.$onChanges = $onChanges;
    vm.getCurrentAnswers = getCurrentAnswers;
    vm.getSelectableAnswerTextById = getSelectableAnswerTextById;
    vm.initOptions = initOptions;
    vm.isAnswerUsed = isAnswerUsed;
    vm.onAnswerSelected = onAnswerSelected;
    vm.trustHtml = trustHtml;
    vm.updateAnswers = updateAnswers;

    //use $onChanges instead of $onInit, in case component is used
    //multiple times for repeated questions of the same type
    //(necessary here because prompt/answer data specific to component logic)
    function $onChanges(changesObj) {
        if (changesObj.currentQuestion) {
            vm.initOptions();
            vm.utils.formatMath();
        }
    }

    function getCurrentAnswers() {
        var answers = [];

        vm.prompts.forEach(function(prompt) {
            if (prompt.selected_answer) {
                var answer = {'prompt_id': prompt.id, 'answer_id': prompt.selected_answer};
                answers.push(answer);
            }
        });

        return answers;
    }

    //for accessibility, when we hide the used options in select for dropdowns, the current value becomes
    //hidden for screenreader users, so we need to set aria-described-by on the select element based on
    //the currently selected answer, but the model only gives us the id, so we need to get the text from that
    function getSelectableAnswerTextById(selectedAnswerId) {
        var answerText = '';
        vm.selectableAnswers.forEach(function(selectableAnswer) {
            if (selectableAnswer.id == selectedAnswerId) {
                answerText = selectableAnswer.answer_text;
            }
        });
        return answerText;
    }

    function initOptions() {
        //reset if necessary (if multiple questions of same type)
        vm.prompts = [];
        vm.selectableAnswers = [];

        vm.currentQuestion.options.forEach(function(qOption) {
            if (qOption.prompt_or_answer == 'prompt') {
                vm.prompts.push(qOption);
            }
            else {
                vm.selectableAnswers.push(qOption);
            }
        });

        vm.trustHtml();

        //for dropdowns shuffle ONLY the selectable answers;
        //prompt order must be maintained for the structure to make sense
        //answers should always be shuffled, otherwise, answer is given away
        vm.utils.shuffle(vm.selectableAnswers);
    }

    function isAnswerUsed(selectableAnswer) {
        if (selectableAnswer.prompt_id) {
            return true;
        }

        return false;
    }

    function onAnswerSelected(prompt, selectableAnswer) {
        var studentAnswer = {'dropdown_answers': []},
            answerComplete = false;

        vm.updateAnswers(prompt);
        studentAnswer.dropdown_answers = vm.getCurrentAnswers();

        if (studentAnswer.dropdown_answers.length === vm.prompts.length) {
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
        vm.prompts.forEach(function(prompt) {
            prompt.answer_text = $sce.trustAsHtml(prompt.answer_text);
        });
    }

    function updateAnswers(prompt) {
        vm.selectableAnswers.forEach(function(selectableAnswer) {
            if (selectableAnswer.id == prompt.selected_answer) {
                //set current option as answered
                selectableAnswer.prompt_id = prompt.id;
            }
            else if (selectableAnswer.prompt_id == prompt.id) {
                //if a previously selected option with this prompt, no longer answered
                selectableAnswer.prompt_id = false;
            }
        });
    }
}