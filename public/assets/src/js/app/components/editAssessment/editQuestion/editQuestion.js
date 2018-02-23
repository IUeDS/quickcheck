app.component('qcEditQuestion', {
    controller: EditQuestionController,
    controllerAs: 'vm',
    bindings: {
        onDelete: '&qcOnDelete',
        onQuestionEdited: '&qcOnQuestionEdited',
        onQuestionReordered: '&qcOnQuestionReordered',
        question: '<qcQuestion',
        questionIndex: '<qcIndex',
        readOnly: '<qcReadOnly',
        totalQuestionCount: '<qcTotalQuestionCount',
        utils: '<qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editQuestionTemplate.html');
    }]
});

EditQuestionController.$inject = ['EditAssessmentConfig', 'HttpService'];

function EditQuestionController(EditAssessmentConfig, HttpService) {
    var vm = this;

    //variables
    vm.questionTypes = EditAssessmentConfig.getQuestionTypes();
    vm.tinymceOptions = EditAssessmentConfig.getTinyMceConfig();

    //functions
    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    vm.deleteQuestion = deleteQuestion;
    vm.getCSSFilePath = getCSSFilePath;
    vm.initializeNewQuestion = initializeNewQuestion;
    vm.isDeleteConfirmed = isDeleteConfirmed;
    vm.isFirstQuestion = isFirstQuestion;
    vm.isLastQuestion = isLastQuestion;
    vm.isNewQuestion = isNewQuestion;
    vm.isQuestionType = isQuestionType;
    vm.onEdited = onEdited;
    vm.onQuestionTypeChanged = onQuestionTypeChanged;
    vm.onSavedOptionDeleted = onSavedOptionDeleted;
    vm.onSubComponentEdited = onSubComponentEdited;
    vm.reorderQuestionDown = reorderQuestionDown;
    vm.reorderQuestionUp = reorderQuestionUp;
    vm.resetOptions = resetOptions;
    vm.toggleQuestionClosed = toggleQuestionClosed;

    function $onInit() {
        if (vm.isNewQuestion()) {
            vm.initializeNewQuestion();
        }

        //tiny mce setup to get app CSS applied to question text
        var fonts = 'https://fonts.googleapis.com/css?family=Open+Sans:400%2C400italic%2C700|Oswald:400%2C300|Holtwood+One+SC|Ultra,',
            cssFilePath = vm.getCSSFilePath();

        vm.tinymceOptions.content_css = fonts + cssFilePath;
    }

    function $onChanges(changesObj) {
        if (changesObj.question) {
            vm.question = changesObj.question.currentValue;
        }
    }

    function deleteQuestion($event) {
        $event.stopPropagation(); //prevent accordion from being activated

        if (!vm.isDeleteConfirmed()) {
            return false;
        }

        vm.onDelete({
            $event: {
                questionIndex: vm.questionIndex
            }
        });
    }

    function getCSSFilePath() {
        //necessary for prod to get to assets, but not for local
        var splitPath = HttpService.getPageRoot().split('/index.php'),
            basePath = splitPath[0],
            cssPath = basePath + '/assets/dist/css/style.min.css';

        return cssPath;
    }

    function initializeNewQuestion() {
        //set question type to multiple choice as a default;
        //the edit multiple choice component will initialize
        //4 options automatically when a question is added.
        vm.question.question_type = vm.questionTypes.multipleChoice.constantName;
    }

    function isDeleteConfirmed() {
        //js alerts cause Protractor to freak out, so don't confirm in reg environment
        if (vm.utils.isRegressionEnv()) {
            return true;
        }

        return window.confirm('Do you really want to delete this question?');
    }

    function isFirstQuestion() {
        if (vm.question.question_order == 1) {
            return true;
        }

        return false;
    }

    function isLastQuestion() {
        if (vm.question.question_order == vm.totalQuestionCount) {
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

    function isQuestionType(questionType) {
        if (vm.question.question_type === vm.questionTypes[questionType].constantName) {
            return true;
        }

        return false;
    }

    function onEdited() {
        vm.onQuestionEdited({
            $event: {
                question: vm.question,
                questionIndex: vm.questionIndex
            }
        });
    }

    function onQuestionTypeChanged(newValue, oldValue) {
        var multipleChoice = vm.questionTypes.multipleChoice.constantName,
            multipleCorrect = vm.questionTypes.multipleCorrect.constantName,
            wasMc = oldValue === multipleChoice || oldValue === multipleCorrect ? true : false,
            isMc = newValue === multipleChoice || newValue === multipleCorrect ? true : false;

        vm.onEdited();

        //if converting between multiple choice and multiple correct, proceed -- not a problem
        if (wasMc && isMc) {
            return;
        }

        //TODO: need to find a way to figure out if user has previously entered text, and if so,
        //give them a confirm() message letting them know that data will be erased
        vm.resetOptions();
    }

    //put all deleted options in an array for back-end to remove
    function onSavedOptionDeleted($event) {
        var option = $event.option;
        if (!vm.question.deletedOptions) {
            vm.question.deletedOptions = [];
        }

        vm.question.deletedOptions.push(option);
    }

    function onSubComponentEdited($event) {
        vm.question = $event.question;
        vm.onEdited();
    }

    function reorderQuestionDown($event) {
        $event.stopPropagation(); //prevent accordion from being activated

        var eventData = {
            $event: {
                newQuestionIndex: vm.questionIndex + 1,
                questionIndex: vm.questionIndex
            }
        };

        vm.onQuestionReordered(eventData);
    }

    function reorderQuestionUp($event) {
        $event.stopPropagation(); //prevent accordion from being activated

        var eventData = {
            $event: {
                newQuestionIndex: vm.questionIndex - 1,
                questionIndex: vm.questionIndex
            }
        };

        vm.onQuestionReordered(eventData);
    }

    //when changing between question types, reset the options so the data doesn't get garbled
    function resetOptions() {
        vm.question.options = [];
    }

    function toggleQuestionClosed() {
        //else clause is necessary here in case closed attr not yet set;
        //this is a front-end construction rather than saved on back-end,
        //so it is not initially set when data sent from back-end on load.
        if (vm.question.questionClosed) {
            vm.question.questionClosed = false;
        }
        else {
            vm.question.questionClosed = true;
        }
    }
}