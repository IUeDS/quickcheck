app.component('qcAssessment', {
    controller: AssessmentController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('assessmentContainerTemplate.html');
    }]
});

AssessmentController.$inject = ['$location', '$sce', 'Assessment', 'Caliper', 'Utilities'];

function AssessmentController($location, $sce, Assessment, Caliper, Utilities) {
    var vm = this;

    //variables
    vm.answerSelected = false;
    vm.assessmentId = '';
    vm.assessmentTitle = null;
    vm.assessmentDescription = null;
    vm.attemptId = false;
    vm.caliper = null;
    vm.complete = false;
    vm.countCorrect = 0;
    vm.countIncorrect = 0;
    vm.currentQuestion = null;
    vm.currentQuestionIndex = 0;
    vm.errorMessage = false;
    vm.feedback = [];
    vm.incorrectRows = null; //matrix and matching only
    vm.isCorrect = false;
    vm.isNextBtnDisabled = false; //have to be careful to prevent double clicking next btn
    vm.modalVisible = false; //for accessibility purposes, hide main when modal is visible
    vm.questions = null;
    vm.partialCredit = false;
    vm.pointsPossible = 0;
    vm.preview = false; //if preview query param in URL, send to server, valid LTI session not needed
    vm.score = 0;
    vm.studentAnswer = null;
    vm.timeoutSecondsRemaining = null; //seconds of timeout remaining, if feature enabled
    vm.utils = new Utilities();

    //functions
    vm.$onInit = $onInit;
    vm.getAssessmentIdFromUrl = getAssessmentIdFromUrl;
    vm.getAttempt = getAttempt;
    vm.hideFeedbackModal = hideFeedbackModal;
    vm.initQuestions = initQuestions;
    vm.isComplete = isComplete;
    vm.isPreview = isPreview;
    vm.isQuestionType = isQuestionType;
    vm.isRowFeedbackShown = isRowFeedbackShown;
    vm.isSubmitDisabled = isSubmitDisabled;
    vm.nextQuestion = nextQuestion;
    vm.onAnswerSelection = onAnswerSelection;
    vm.onCompletion = onCompletion;
    vm.parseCaliperData = parseCaliperData;
    vm.parseTimeoutData = parseTimeoutData;
    vm.resetQuestionVariables = resetQuestionVariables;
    vm.restart = restart;
    vm.showErrorModal = showErrorModal;
    vm.showFeedback = showFeedback;
    vm.showTimeoutModal = showTimeoutModal;
    vm.shuffleAnswerOptions = shuffleAnswerOptions;
    vm.shuffleQuestions = shuffleQuestions;
    vm.submitAnswer = submitAnswer;
    vm.updateScore = updateScore;

    function $onInit() {
        vm.getAssessmentIdFromUrl();
        vm.preview = vm.isPreview();

        if (!vm.utils.areCookiesEnabled()) {
            var errorMessage = vm.utils.getCookieErrorMsg();
            vm.showErrorModal(errorMessage);
            return;
        }

        vm.utils.loadingStarted();
        Assessment.initAttempt(vm.assessmentId, vm.preview)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.attemptId = data.attemptId;
                vm.parseCaliperData(data);
                vm.parseTimeoutData(data);
                vm.utils.loadingFinished();
            }, function (resp) {
                var serverError = vm.utils.getQuizError(resp),
                    errorMessage = serverError ? serverError : 'Error initializing attempt.';
                vm.showErrorModal(errorMessage);
                vm.utils.loadingFinished();
            });

        vm.initQuestions();
    }

    //get the assessment id from the Laravel url, /assessment/{id} and separate from query strings at the end, if necessary;
    //OR if in LTI and using query string /assessment?id=, then grab that
    function getAssessmentIdFromUrl() {
        var queryParams = $location.search(),
            assessmentId = '';
        if (queryParams.id) {
            assessmentId = queryParams.id;
        }
        else {
            var splitUrl = $location.path().split('/'),
                lastParam = splitUrl[splitUrl.length - 1],
                splitQuery = lastParam.split('?'); //even if no query string, returns a single string in array for us to grab
            assessmentId = splitQuery[0];
        }

        vm.assessmentId = assessmentId;
    }

    function getAttempt() {
        var complete = '0',
            lastMilestone = 'question phase';

        if (vm.currentQuestionIndex == vm.questions.length - 1) {
            complete = '1';
            lastMilestone = 'complete';
        }

        return {
            'id': vm.attemptId,
            'last_milestone': lastMilestone,
            'complete': complete,
        };
    }

    function hideFeedbackModal() {
        $('#qc-feedback-modal').modal('hide');
        vm.modalVisible = false;
    }

    function initQuestions() {
        vm.utils.loadingStarted();
        Assessment.getQuestions(vm.assessmentId)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.assessmentTitle = data.title;
                vm.assessmentDescription = data.description;
                vm.questions = data.questions;
                //to ensure that iframe videos can be embedded, angular requires that
                //the html be trusted (otherwise interpreted as an XSS attack)
                vm.questions.forEach(function(question) {
                    question.question_text = $sce.trustAsHtml(question.question_text);
                });
                vm.shuffleAnswerOptions();
                if (data.shuffled == 'true') {
                    vm.shuffleQuestions();
                }
                vm.pointsPossible = vm.questions.length;
                vm.currentQuestion = vm.questions[vm.currentQuestionIndex];
                vm.utils.loadingFinished();
            }, function (resp) {
                var serverError = vm.utils.getQuizError(resp),
                    errorMessage = serverError ? serverError : 'Error retrieving questions.';
                vm.showErrorModal(errorMessage);
                vm.utils.loadingFinished();
            });
    }

    function isComplete() {
        if (vm.countCorrect + vm.countIncorrect === vm.questions.length) {
            return true;
        }

        return false;
    }

    function isPreview() {
        var queryParams = $location.search(),
            isPreview = queryParams.preview;

        if (isPreview) {
            return true;
        }

        return false;
    }

    function isQuestionType(questionType) {
        if (vm.currentQuestion.question_type == questionType) {
            return true;
        }

        return false;
    }

    function isRowFeedbackShown() {
        if (vm.isQuestionType('matrix') || vm.isQuestionType('matching')) {
            return true;
        }

        return false;
    }

    function isSubmitDisabled() {
        if (!vm.answerSelected || vm.incorrectRows || vm.utils.loading) {
            return true;
        }

        return false;
    }

    function nextQuestion() {
        vm.isNextBtnDisabled = true; //disable next button to prevent double clicking (skips a question)
        vm.currentQuestionIndex++;

        if (vm.isComplete()) {
            vm.onCompletion();
            return;
        }

        if (!vm.isRowFeedbackShown()) {
            vm.hideFeedbackModal();
        }
        vm.resetQuestionVariables();
        vm.currentQuestion = vm.questions[vm.currentQuestionIndex];
        vm.utils.setLtiHeight();
        //focus to question number and change title for accessibility
        vm.utils.focusToElement('.qc-question-number');
        $('title').text('Take assessment - Question ' + (vm.currentQuestionIndex + 1) + ' out of ' + vm.pointsPossible);
    }

    function onAnswerSelection($event) {
        vm.studentAnswer = $event.studentAnswer;
        vm.studentAnswer.questionType = vm.currentQuestion.question_type;
        if ($event.answerComplete) {
            vm.answerSelected = true;
        }
        //make sure if student un-selects an answer, to revert
        else {
            vm.answerSelected = false;
        }
    }

    function onCompletion() {
        vm.hideFeedbackModal();
        $('#qc-completion-modal').modal({backdrop: 'static', keyboard: false});
        vm.modalVisible = true;
        vm.utils.focusToElement('.qc-btn-restart-assessment');
    }

    function parseCaliperData(data) {
        var caliperData = data.caliper;

        if (!caliperData) {
            return false;
        }

        if (!vm.caliper) {
            vm.caliper = new Caliper(caliperData);
        }

        if (!vm.caliper.isEnabled()) {
            return false;
        }

        vm.caliper.forwardEvent(caliperData);
    }

    function parseTimeoutData(data) {
        if (!data.timeoutRemaining || data.timeoutRemaining <= 0) {
            return;
        }

        vm.showTimeoutModal(data.timeoutRemaining);
    }

    function resetQuestionVariables() {
        vm.currentQuestion = null;
        vm.studentAnswer = null;
        vm.answerSelected = false;
        vm.isCorrect = false;
        vm.incorrectRows = null;
        vm.partialCredit = false;
    }

    function restart() {
        //hard page refresh to ensure a new attempt is created
        window.location.reload();
    }

    function showErrorModal(errorMessage) {
        vm.errorMessage = errorMessage;
        vm.modalVisible = true;
    }

    function showFeedback(data) {
        vm.feedback = data.feedback;
        vm.isNextBtnDisabled = false; //un-disable next button (disabled in component to prevent double clicking)
        //show modal feedback for all questions except for matrix and matching, which gives incorrect rows in table
        //also, matrix and matching assign partial credit
        if (vm.isRowFeedbackShown()) {
            vm.incorrectRows = data.incorrectRows;
            vm.utils.focusToElement('.qc-row-feedback');
        }
        else {
            //prevent student from clicking outside of modal to close it
            $('#qc-feedback-modal').modal({backdrop: 'static', keyboard: false});
            vm.modalVisible = true;
            vm.utils.formatMath(); //if equations are shown in the feedback
            vm.utils.focusToElement('.qc-continue-btn');
        }
    }

    function showTimeoutModal(timeoutSecondsRemaining) {
        vm.timeoutSecondsRemaining = timeoutSecondsRemaining;
        $('#qc-assessment-timeout-modal').modal({backdrop: 'static', keyboard: false});
        vm.modalVisible = true;
    }

    //if any of the questions have random order for the answer options, then shuffle them
    function shuffleAnswerOptions() {
        vm.questions.forEach(function(question) {
            if (question.randomized == 'true' && question.options) {
                vm.utils.shuffle(question.options);
            }
        });
    }

    //shuffle question order
    function shuffleQuestions() {
        vm.utils.shuffle(vm.questions);
    }

    function submitAnswer() {
        vm.utils.loadingStarted(); //do this right away to prevent super fast double clicks
        var submission = {};
        submission.studentAnswer = vm.studentAnswer;
        submission.attempt = vm.getAttempt();
        Assessment.submitQuestion(vm.currentQuestion.id, submission)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.isCorrect = data.isCorrect;
                vm.updateScore(data);
                vm.showFeedback(data);
                vm.utils.loadingFinished();
                vm.parseCaliperData(data);
                if (vm.isComplete()) {
                    vm.complete = true;
                }
            }, function(resp) {
                var serverError = vm.utils.getQuizError(resp),
                    errorMessage = serverError ? serverError : 'Error submitting answer.';
                vm.showErrorModal(errorMessage);
                vm.utils.loadingFinished();
            });
    }

    function updateScore(data) {
        if (vm.isCorrect) {
            vm.countCorrect++;
            vm.score += 1;
            return;
        }

        vm.countIncorrect++;
        if (data.credit) {
            var newScore = (vm.score + data.credit).toFixed(2);
            vm.score = +(newScore);
            vm.partialCredit = true;
        }
    }
}