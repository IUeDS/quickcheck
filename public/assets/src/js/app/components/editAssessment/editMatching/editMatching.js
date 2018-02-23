app.component('qcEditMatching', {
    controller: EditMatchingController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        onSavedOptionDeleted: '&qcOnSavedOptionDeleted',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editMatchingTemplate.html');
    }]
});

EditMatchingController.$inject = ['$timeout', 'Utilities'];

function EditMatchingController($timeout, Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    vm.addDistractor = addDistractor;
    vm.addPrompt = addPrompt;
    vm.deleteDistractor = deleteDistractor;
    vm.deletePrompt = deletePrompt;
    vm.initOptions = initOptions;
    vm.isDistractor = isDistractor;
    vm.isInvalid = isInvalid;
    vm.isSavedPrompt = isSavedPrompt;
    vm.onEdited = onEdited;
    vm.onSubComponentEdited = onSubComponentEdited;

    function $onInit() {
        vm.initOptions();
        //when a new question is added, want to ensure validation is run immediately;
        //prevent a user from saving a new question without data added in.
        if (vm.isInvalid()) {
            vm.onEdited();
        }
    }

    function $onChanges(changesObj) {
        if (changesObj.question) {
            vm.question = changesObj.question.currentValue;
            vm.initOptions();
        }
    }

    function addDistractor() {
        var tempId = (vm.question.options.length + 1).toString() + '-temp',
            distractor = {
                'id': tempId,
                'question_id': vm.question.id,
                'option_text': '',
                'prompt_or_answer': 'answer',
                'matching_answer_text': ''
            };

        vm.question.options.push(distractor);
        vm.question.distractors.push(distractor);

        vm.onEdited();

        //focus to this element after adding it
        $timeout(function() {
            vm.utils.focusToElement('#matching-distractor-' + vm.question.id + '-' + tempId);
        }, 0, false);
    }

    function addPrompt() {
        var tempId = (vm.question.options.length + 1).toString() + '-temp',
            prompt = {
                'id': tempId,
                'question_id': vm.question.id,
                'option_text': '',
                'prompt_or_answer': 'prompt',
                'matching_answer_text': ''
            };

        //for matching options, we create the prompt and a text input field for the answer,
        //with the model bound to prompt.matching_answer_text; in the backend, we create
        //the options that are answers according to this data, so basically, only prompts
        //are pushed from client to server, and server automatically makes answer options
        //based on the answers written in the text input box for each matching prompt.
        vm.question.options.push(prompt);
        vm.question.prompts.push(prompt);

        vm.onEdited();

        //focus to this element after adding it
        $timeout(function() {
            vm.utils.focusToElement('#matching-prompt-' + vm.question.id + '-' + tempId);
        }, 0, false);
    }

    function deleteDistractor($event) {
        var distractor = $event.option,
            index = $event.index;

        //parent question component keeps track of all deleted options to pass to back-end
        if (distractor.id.toString().indexOf('temp') === -1) {
            vm.onSavedOptionDeleted({$event: { option: distractor }});
        }

        vm.question.distractors.splice(index, 1);
        vm.onEdited();
    }

    function deletePrompt($event) {
        var prompt = $event.option,
            index = $event.index;

        //parent question component keeps track of all deleted options to pass to back-end
        if (prompt.id.toString().indexOf('temp') === -1) {
            vm.onSavedOptionDeleted({$event: { option: prompt }});
        }

        //we need to delete not only the prompt, but also its paired answer, if it exists
        //(if dealing with a distractor, no action necessary)
        if (vm.isSavedPrompt(prompt)) {
            vm.question.selectableAnswers.forEach(function(selectableAnswer, answerIndex) {
                if (selectableAnswer.id == prompt.matching_answer_id) {
                    vm.onSavedOptionDeleted({$event: { option: selectableAnswer }});
                    vm.question.selectableAnswers.splice(answerIndex, 1);
                }
            });
        }

        //delete prompt
        vm.question.prompts.splice(index, 1);
        vm.onEdited();
    }

    function initOptions() {
        vm.question.prompts = [];
        vm.question.selectableAnswers = [];
        vm.question.distractors = [];
        vm.question.options.forEach(function(qOption) {
            if (qOption.prompt_or_answer == 'prompt') {
                vm.question.prompts.push(qOption);
            }
            else {
                vm.question.selectableAnswers.push(qOption);
                if (vm.isDistractor(qOption)) {
                    vm.question.distractors.push(qOption);
                }
            }
        });

        //Attach the answer ID to each prompt, so that when we're saving on the back-end,
        //if the text changes in the answer, we can still update it properly.
        //(The text input for the answer is bound to prompt.matching_answer_text
        //and if that text changes, the tie between prompt and answer is lost, since there
        //is no ID connecting them. A little clunky, but not sure how to better handle it.)
        vm.question.prompts.forEach(function(prompt) {
            vm.question.selectableAnswers.forEach(function(selectableAnswer) {
                if (prompt.matching_answer_text == selectableAnswer.option_text) {
                    prompt.matching_answer_id = selectableAnswer.id;
                }
            });
        });
    }

    function isDistractor(qOption) {
        var isDistractor = true;

        //if a prompt's answer matches this option's text, then it is a correct answer option and not a distractor
        vm.question.options.forEach(function(thisOption) {
            if (thisOption.prompt_or_answer === 'prompt' && thisOption.matching_answer_text && thisOption.matching_answer_text === qOption.option_text) {
                isDistractor = false;
            }
        });

        return isDistractor;
    }

    function isInvalid() {
        if (vm.question.prompts.length) {
            return false;
        }

        return 'No answer options were added to this question.';
    }

    function isSavedPrompt(option) {
        if (option.matching_answer_id) {
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