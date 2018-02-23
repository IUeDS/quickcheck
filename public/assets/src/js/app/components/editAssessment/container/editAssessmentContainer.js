app.component('qcEditAssessment', {
    controller: EditAssessmentController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editAssessmentContainerTemplate.html');
    }]
});

EditAssessmentController.$inject = ['$location', '$anchorScroll', '$timeout', 'AssessmentEdit', 'User', 'Utilities'];

function EditAssessmentController($location, $anchorScroll, $timeout, AssessmentEdit, User, Utilities) {
    var vm = this;

    //functions
    vm.addQuestion = addQuestion;
    vm.canViewCustomActivity = canViewCustomActivity;
    vm.focusToQuestion = focusToQuestion;
    vm.getAssessmentId = getAssessmentId;
    vm.getQuestionCount = getQuestionCount;
    vm.getUserAndPermissions = getUserAndPermissions;
    vm.init = init;
    vm.initData = initData;
    vm.isQuestionAdded = isQuestionAdded;
    vm.onEdited = onEdited;
    vm.onQuestionDeleted = onQuestionDeleted;
    vm.onQuestionEdited = onQuestionEdited;
    vm.onQuestionReordered = onQuestionReordered;
    vm.saveAssessment = saveAssessment;
    vm.setModelIntegers = setModelIntegers;
    vm.toggleShuffled = toggleShuffled;
    vm.updateQuestionOrder = updateQuestionOrder;
    vm.validate = validate;

    //variables
    vm.admin = false;
    vm.assessment = null;
    vm.assessmentGroups = null;
    vm.assessmentId = null;
    vm.collection = null;
    vm.currentPage = 'sets';
    vm.customActivity = null;
    vm.customActivityAdded = false;
    vm.edited = false;
    vm.questions = null;
    vm.readOnly = false;
    vm.saved = true;
    vm.user = null;
    vm.utils = new Utilities();
    vm.validationError = false; //if validation errors, show a warning
    vm.validationErrorList = [];

    vm.init();

    function init(assessmentSaved) {
        vm.assessmentId = vm.getAssessmentId();
        vm.utils.loadingStarted();
        AssessmentEdit.getAssessment(vm.assessmentId)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.initData(data);
                vm.utils.loadingFinished();
                if (assessmentSaved) {
                    vm.saved = true;
                    //scroll to bottom, to make sure success alert is visible (it was jumping around with focus)
                    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
                    vm.utils.focusToElement('#qc-save-success');
                }
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function initData(data) {
        vm.assessment = data.assessment;
        vm.questions = data.questions;
        vm.collection = data.collection;
        vm.assessmentGroups = data.assessmentGroups;
        vm.customActivity = data.customActivity;
        if (vm.customActivity) {
            vm.customActivityAdded = true;
        }
        vm.setModelIntegers();
        vm.getUserAndPermissions(); //determine if user is an admin and permissions

        //a little clunky, but it was flat out impossible to get the LTI height correct
        //in chrome on initial page load; FF was fine, and Chrome works fine as soon as
        //anything is edited. Moving this function to sub-components was not working.
        //so, wait for a few seconds, after components all load, then set the height.
        $timeout(function() {
            vm.utils.setLtiHeight();
        }, 3000, false);
    }

    function addQuestion() {
        var question,
            questionOrder = vm.getQuestionCount() + 1,
            tempId = questionOrder.toString() + '-temp';

        vm.questions.push({
            'id': tempId,
            'question_order': questionOrder,
            'question_text': '',
            'question_type': 'multiple_choice',
            'randomized': 'true',
            'multiple_correct': 'false',
            'options': []
        });

        vm.onEdited();
        question = vm.questions[vm.questions.length - 1];
        vm.utils.setLtiHeight();
        vm.focusToQuestion(question);
    }

    function canViewCustomActivity() {
        if (vm.admin || vm.customActivityAdded) {
            return true;
        }

        return false;
    }

    function focusToQuestion(question) {
        questionId = '#question-header-' + question.question_order;
        $timeout(function() {
            vm.utils.focusToElement(questionId);
            //scroll to question (it gets jittery in the iframe after resetting LTI height)
            $location.hash(questionId);
            $anchorScroll();
        }, 0, false);
    }

    function getAssessmentId() {
        //get the assessment id from the Laravel url, /assessment/{id}/edit
        var splitUrl = $location.path().split('/'),
            assessmentId = splitUrl[splitUrl.length - 2];

        return assessmentId;
    }

    function getQuestionCount() {
        return vm.questions.length;
    }

    function getUserAndPermissions() {
        //if we're reloading after a save, don't re-fetch this info
        if (vm.user) {
            return;
        }

        User.getUserAndPermissions(vm.collection.id)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.user = data.user;
                vm.readOnly = data.readOnly;
                if (vm.user.admin == 'true') {
                    vm.admin = true;
                }
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function isQuestionAdded() {
        var questionFound = false;

        if (!vm.questions) { //i.e., custom activity
            return false;
        }

        if (!vm.questions.length) {
            return false;
        }

        return true;
    }

    function onEdited() {
        vm.edited = true; //only show "saved" success message if edits made
        vm.saved = false; //indicate unsaved changes
        vm.utils.setLtiHeight();
    }

    function onQuestionDeleted($event) {
        var questionIndex = $event.questionIndex,
            question = vm.questions[questionIndex];

        //only if the question had been previously saved, keep in a separate
        //array to send to back-end to delete; otherwise, just scrap it
        if (question.id.toString().indexOf('temp') === -1) {
            if (!vm.assessment.deletedQuestions) {
                vm.assessment.deletedQuestions = [];
            }
            vm.assessment.deletedQuestions.push(question);
        }

        vm.questions.splice(questionIndex, 1);
        vm.updateQuestionOrder();
        vm.onEdited();
        vm.utils.setLtiHeight();
    }

    function onQuestionEdited($event) {
        var question = $event.question,
            questionIndex = $event.questionIndex;

        vm.questions[questionIndex] = question;
        vm.onEdited();
    }

    function onQuestionReordered($event) {
        var newQuestionIndex = $event.newQuestionIndex,
            questionIndex = $event.questionIndex,
            tempQuestion = angular.copy(vm.questions[newQuestionIndex]);

        //swap
        vm.questions[newQuestionIndex] = vm.questions[questionIndex];
        vm.questions[questionIndex] = tempQuestion;
        vm.updateQuestionOrder();
        vm.focusToQuestion(vm.questions[newQuestionIndex]);
        vm.onEdited();
    }

    function saveAssessment() {
        //bit of an edge case, but make sure save success message still appears
        //even if no changes made to the data, technically
        vm.saved = false;
        vm.edited = true;
        if (!vm.validate()) {
            vm.utils.focusToElement('#qc-validation-error');
            return;
        }

        //wrap everything up in a nice little package to send to the server
        vm.assessment.questions = vm.questions;
        vm.utils.loadingStarted();
        AssessmentEdit.updateAssessment(vm.assessmentId, {'assessment': vm.assessment})
            .then(function(resp) {
                vm.init(true); //reload quiz so we have correct IDs and such after saving
            }, function(resp) {
                vm.saved = false;
                vm.utils.showError(resp);
            });
    }

    //very annoying that I have to do this, but apparently in Angular, ng-model will
    //not bind to the proper value for the assessment group/custom activity dropdowns
    //because it is an integer, but it is compared strictly with the string in the select
    //value; so I have to manually change the id values to a string so it will match;
    //the back-end shouldn't mind, but front-end does
    function setModelIntegers() {
        vm.assessment.assessment_group_id = vm.assessment.assessment_group_id.toString();
        if (vm.customActivity) {
            vm.customActivity.id = vm.customActivity.id.toString();
            vm.assessment.custom_activity_id = vm.assessment.custom_activity_id.toString();
        }
    }

    function toggleShuffled() {
        if (vm.assessment.shuffled == 'true') {
            vm.assessment.shuffled = 'false';
        }
        else {
            vm.assessment.shuffled = 'true';
        }

        vm.onEdited();
    }

    function updateQuestionOrder() {
        vm.questions.forEach(function(question, index) {
            question.question_order = index + 1;
        });
    }

    function validate() {
        vm.validationError = false; //reset
        vm.validationErrorList = []; //reset
        vm.questions.forEach(function(question) {
            if (question.validationError) {
                var error = 'Question #' + question.question_order + ': ' + question.validationError;
                vm.validationErrorList.push(error);
            }
        });

        if (vm.validationErrorList.length) {
            vm.validationError = true;
            return false;
        }

        return true;
    }

    //Ask user if they really want to leave the page if unsaved changes
    window.onbeforeunload = function(event) {
        if (vm.saved || vm.readOnly) {
            //changes are saved, or user has read-only permissions and can't make changes,
            //so let the user head out the door
        }
        else {
            //browser should confirm to user that they want to leave the page
            return 'You have unsaved changes.';
        }
    };
}