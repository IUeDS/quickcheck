app.component('qcResponses', {
    controller: ResponsesController,
    controllerAs: 'vm',
    bindings: {
        attemptData: '<qcAttempt',
        courseContext: '<qcCourseContext',
        studentResponsesData: '<qcResponses',
        questionsData: '<qcQuestions',
        isStudentData: '<qcIsStudent'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('responsesTemplate.html');
    }]
});

ResponsesController.$inject = ['$sce', 'Utilities'];

function ResponsesController($sce, Utilities) {
    var vm = this;

    //scope variables
    vm.showTableView = false;
    vm.correctIconClass = 'fa-long-arrow-right'; //so we can easily swap out the correct icon
    vm.utils = new Utilities();

    //scope functions
    vm.getCountCorrect = getCountCorrect;
    vm.getCountIncorrect = getCountIncorrect;
    vm.getScoreOutof100 = getScoreOutof100;
    vm.$onInit = $onInit;
    vm.initMatchingOrDropdownOptions = initMatchingOrDropdownOptions;
    vm.initMatrixOptions = initMatrixOptions;
    vm.isMatrixAnswerCorrect = isMatrixAnswerCorrect;
    vm.markCorrectandIncorrectResponses = markCorrectandIncorrectResponses;
    vm.markDropdownResponses = markDropdownResponses;
    vm.markMatchingResponses = markMatchingResponses;
    vm.markMatrixResponses = markMatrixResponses;
    vm.markMCResponses = markMCResponses;
    vm.markNumericalResponse = markNumericalResponse;
    vm.markTextmatchResponse = markTextmatchResponse;
    vm.parseResponseData = parseResponseData;

    function $onInit() {
        //copy the passed in data so changes we make within this component
        //to parse/format the data do not hold over; oddly, since the
        //component is reused, data from one student can sometimes hold
        //over to the next student, even when the component is re-initialized.
        //seems to be an angular quirk with the < scope operator.
        vm.attempt = angular.copy(vm.attemptData);
        vm.studentResponses = angular.copy(vm.studentResponsesData);
        vm.questions = angular.copy(vm.questionsData);
        vm.isStudent = angular.copy(vm.isStudentData);

        vm.parseResponseData();
        vm.getScoreOutof100();
        vm.utils.formatMath(); //if equations present, format LaTeX
        vm.utils.setLtiHeight();
    }

    //some custom activities use a range of 0-1 rather than 0-100
    function getScoreOutof100() {
        var score = vm.attempt.calculated_score;
        vm.attempt.score = score <= 1 ? score * 100 : score;
    }

    function parseResponseData() {
        //first, check to see if this is either a custom activity (table view) or quick check (response view)
        //custom activity
        if (vm.studentResponses[0].custom_responses.length) {
            vm.showTableView = true;
        }
        //quick check
        else {
            vm.studentResponses.forEach(function(studentResponse, index) {
                if (!vm.markCorrectandIncorrectResponses(studentResponse)) {
                    //if no response match found and we can't mark it up, display error
                    vm.questions[index].error = true;
                }
            });
        }
    }

    function markCorrectandIncorrectResponses(studentResponse) {
        var answerFound = false;

        //make isCorrect a little cleaner, in boolean form, for cleaner conditionals
        if (studentResponse.is_correct == '1') {
            studentResponse.isCorrect = true;
        }
        else {
            studentResponse.isCorrect = false;
        }

        //we can't fetch the question until we dive into the internals of student responses;
        //we can't rely on question order if a quiz is shuffled;
        //therefore, in each one of these, we need to loop through questions/options to get a match;
        //sure, there are more efficient solutions, but we are guaranteed a small dataset here,
        //since this is one student's responses to one quiz, so not worth the effort of optimizing
        //TODO: regardless, I would like to refactor and clean up the logic
        if (studentResponse.mc_responses.length) {
            answerFound = vm.markMCResponses(studentResponse);
        }
        else if (studentResponse.textmatch_responses.length) {
            answerFound = vm.markTextmatchResponse(studentResponse);
        }
        else if (studentResponse.numerical_responses.length) {
            answerFound = vm.markNumericalResponse(studentResponse);
        }
        else if (studentResponse.matrix_responses.length) {
            answerFound = vm.markMatrixResponses(studentResponse);
        }
        else if (studentResponse.matching_responses.length) {
            answerFound = vm.markMatchingResponses(studentResponse);
        }
        else if (studentResponse.dropdown_responses.length) {
            answerFound = vm.markDropdownResponses(studentResponse);
        }

        return answerFound;
    }

    function markMCResponses(studentResponse) {
        var answerFound = false;

        studentResponse.mc_responses.forEach(function(mcOption) {
            vm.questions.forEach(function(question) {
                var questionType = question.question_type;
                if (questionType === 'multiple_choice' || questionType === 'multiple_correct') {
                    question.options.forEach(function(option) {
                        if (option.id == mcOption.mc_answer_id) {
                            option.studentAnswer = true;
                            answerFound = true;
                            question.studentResponse = studentResponse;
                        }
                    });
                }
            });
        });
        return answerFound;
    }

    function markTextmatchResponse(studentResponse) {
        var answerFound = false;

        vm.questions.forEach(function(question) {
            if (question.question_type === 'textmatch') {
                if (question.id == studentResponse.textmatch_responses[0].question_id) {
                    answerFound = true;
                    question.studentResponse = studentResponse;
                    question.studentAnswer = studentResponse.textmatch_responses[0].student_answer_text;
                }
            }
        });

        return answerFound;
    }

    function markNumericalResponse(studentResponse) {
        var answerFound = false;

        vm.questions.forEach(function(question) {
            if (question.question_type === 'numerical') {
                if (question.id == studentResponse.numerical_responses[0].question_id) {
                    answerFound = true;
                    question.studentResponse = studentResponse;
                    question.studentAnswer = studentResponse.numerical_responses[0].student_answer_value;
                }
            }
        });

        return answerFound;
    }

    function markMatrixResponses(studentResponse) {
        var answerFound = false,
            matchesFound = 0,
            numRows = 0,
            col = false,
            row = false,
            question = false;

        vm.questions.forEach(function(thisQuestion) {
            if (thisQuestion.question_type === 'matrix') {
                thisQuestion.options.forEach(function(option) {
                    if (option.id == studentResponse.matrix_responses[0].matrix_row_id) {
                        question = thisQuestion;
                        question.studentResponse = studentResponse;
                    }
                });
            }
        });

        //if we couldn't find the question
        if (!question) {
            return false;
        }

        //first, get the number of rows, so we can ensure that all answers are marked
        question.options.forEach(function(option) {
            if (option.row_or_column === 'row') {
                numRows++;
            }
        });

        //next, match student responses in each row to their corresponding column
        studentResponse.matrix_responses.forEach(function(matrixResponse) {
            col = false;
            row = false;
            question.options.forEach(function(option) {
                if (matrixResponse.matrix_row_id == option.id) {
                    row = option;
                }
                if (matrixResponse.matrix_column_id == option.id) {
                    col = option;
                }
            });

            if (col && row) {
                matchesFound++;
                row.studentAnswer = col;
            }
        });

        if (matchesFound === numRows) {
            answerFound = true;
        }
        vm.initMatrixOptions(question);

        return answerFound;
    }

    function markMatchingResponses(studentResponse) {
        var answerFound = false,
            matchesFound = 0,
            numPrompts = 0,
            prompt = false,
            answer = false,
            question = false;

        vm.questions.forEach(function(thisQuestion) {
            if (thisQuestion.question_type === 'matching') {
                thisQuestion.options.forEach(function(option) {
                    if (option.id == studentResponse.matching_responses[0].matching_prompt_id) {
                        question = thisQuestion;
                        question.studentResponse = studentResponse;
                    }
                });
            }
        });

        //if we couldn't find the question
        if (!question) {
            return false;
        }

        //first, get the number of prompts, so we can ensure that all answers are marked
        question.options.forEach(function(option) {
            if (option.prompt_or_answer === 'prompt') {
                numPrompts++;
            }
        });

        //next, match student responses in each prompt to their corresponding answer
        studentResponse.matching_responses.forEach(function(matchingResponse) {
            prompt = false;
            answer = false;
            question.options.forEach(function(option) {
                if (matchingResponse.matching_prompt_id == option.id) {
                    prompt = option;
                }
                if (matchingResponse.matching_answer_id == option.id) {
                    answer = option;
                }
            });

            if (prompt && answer) {
                matchesFound++;
                prompt.studentAnswer = answer;
            }
        });

        if (matchesFound === numPrompts) {
            answerFound = true;
        }
        vm.initMatchingOrDropdownOptions(question);

        return answerFound;
    }

    function markDropdownResponses(studentResponse) {
        var answerFound = false,
            matchesFound = 0,
            numPrompts = 0,
            prompt = false,
            answer = false,
            question = false;

        vm.questions.forEach(function(thisQuestion) {
            if (thisQuestion.question_type === 'dropdown') {
                thisQuestion.options.forEach(function(option) {
                    if (option.id == studentResponse.dropdown_responses[0].dropdown_prompt_id) {
                        question = thisQuestion;
                        question.studentResponse = studentResponse;
                    }
                });
            }
        });

        //if we couldn't find the question
        if (!question) {
            return false;
        }

        //first, get the number of prompts, so we can ensure that all answers are marked
        question.options.forEach(function(option) {
            if (option.prompt_or_answer === 'prompt') {
                numPrompts++;
            }
        });

        //next, match student responses in each prompt to their corresponding answer
        studentResponse.dropdown_responses.forEach(function(dropdownResponse) {
            prompt = false;
            answer = false;
            question.options.forEach(function(option) {
                if (dropdownResponse.dropdown_prompt_id == option.id) {
                    prompt = option;
                }
                if (dropdownResponse.dropdown_answer_id == option.id) {
                    answer = option;
                }
            });

            if (prompt && answer) {
                matchesFound++;
                prompt.studentAnswer = answer;
            }
        });

        if (matchesFound === numPrompts) {
            answerFound = true;
        }
        vm.initMatchingOrDropdownOptions(question);

        return answerFound;
    }

    function isMatrixAnswerCorrect(row, column) {
        return row.matrix_answer_text == column.answer_text ? true : false;
    }

    function initMatrixOptions(question) {
        question.columns = [];
        question.rows = [];
        question.options.forEach(function(qOption) {
            if (qOption.row_or_column == 'row') {
                question.rows.push(qOption);
            }
            else {
                question.columns.push(qOption);
            }
        });
    }

    function initMatchingOrDropdownOptions(question) {
        question.prompts = [];
        question.selectableAnswers = [];
        question.options.forEach(function(qOption) {
            if (qOption.prompt_or_answer == 'prompt') {
                question.prompts.push(qOption);
            }
            else {
                question.selectableAnswers.push(qOption);
            }
        });
    }

    //custom activities send count correct to the back-end, but quizzes calculate based on responses
    function getCountCorrect(attempt) {
        if (attempt.count_correct !== null) {
            return attempt.count_correct;
        }
        else {
            var countCorrect = 0;
            vm.studentResponses.forEach(function(response) {
                if (response.is_correct == '1') {
                    countCorrect++;
                }
            });
            return countCorrect;
        }
    }

    //custom activities send count correct to the back-end, but quizzes calculate based on responses
    function getCountIncorrect(attempt) {
        if (attempt.count_incorrect !== null) {
            return attempt.count_incorrect;
        }
        else {
            var countIncorrect = 0;
            vm.studentResponses.forEach(function(response) {
                if (response.is_correct == '0') {
                    countIncorrect++;
                }
            });
            return countIncorrect;
        }
    }
}