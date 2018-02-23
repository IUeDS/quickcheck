app.component('qcMatching', {
    controller: MatchingController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        incorrectRows: '<qcIncorrectRows',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('matchingTemplate.html');
    }]
});

MatchingController.$inject = ['$sce', 'Utilities'];

function MatchingController($sce, Utilities) {
    var vm = this;

    vm.prompts = [];
    vm.selectableAnswers = [];
    vm.utils = new Utilities();

    vm.$onChanges = $onChanges;
    vm.checkRowCorrectness = checkRowCorrectness;
    vm.getCurrentAnswers = getCurrentAnswers;
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
            vm.utils.setLtiHeight();
        }
    }

    function checkRowCorrectness(prompt) {
        if (!vm.incorrectRows) {
            return true;
        }

        var correct = true;

        vm.incorrectRows.forEach(function(incorrectRow) {
            if (prompt.id == incorrectRow.id) {
                correct = false;
            }
        });

        return correct;
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
    }

    function isAnswerUsed(selectableAnswer) {
        if (selectableAnswer.prompt_id) {
            return true;
        }

        return false;
    }

    function onAnswerSelected(prompt, selectableAnswer) {
        var studentAnswer = {'matching_answers': []},
            answerComplete = false;

        vm.updateAnswers(prompt);
        studentAnswer.matching_answers = vm.getCurrentAnswers();

        if (studentAnswer.matching_answers.length === vm.prompts.length) {
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
            prompt.option_text = $sce.trustAsHtml(prompt.option_text);
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