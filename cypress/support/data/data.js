module.exports = {
    customActivity: {
        'name': 'Test custom activity',
        'description': 'Description of the activity',
        'url': 'test/testing.html',
        'dev': 'Kermit the frog'
    },

    featureNames: [
        'AUTOMATIC GRADE PASSBACK',
        'HIDE EMPTY ATTEMPTS',
        'SHOW RESPONSES IN STUDENT VIEW',
        'TIMEOUT FOR EXCESSIVE ATTEMPTS'
    ],

    //none at this time
    featureNamesAdmin: [],

    qtiImports: {
        'quiz1': 'Assessment QTI Export Research',
        'quiz2': 'Assessment QTI Export Research 2'
    },

    questionTypes: {
        'dropdowns': 'Multiple dropdowns',
        'matching': 'Matching',
        'matrix': 'Matrix',
        'mc': 'Multiple choice',
        'mcorrect': 'Multiple correct (checkboxes)',
        'numerical': 'Numerical',
        'textmatch': 'Text match',
        'drag_and_drop': 'Drag and drop'
    },

    quizData: {
        'quiz1': {
            'question1': {
                'questionText': 'Answer is B',
                'option1': 'A',
                'option2': 'B',
                'option3': 'C',
                'option4': 'D',
                'answer': 'B',
                'answerKey': 'B',
                'feedbackOption1': 'A feedback',
                'feedbackOption2': 'B feedback',
                'feedbackOption3': 'C feedback',
                'feedbackOption4': 'D feedback'
            },
            'question2': {
                'option1': 'A',
                'option2': 'B',
                'option3': 'C',
                'option4': 'D',
                'answer1': 0,
                'answer2': 1,
                'answerKey': 'Multiple options are considered correct for this question: A; B;',
                'feedbackOption1': 'A feedback',
                'feedbackOption2': 'B feedback',
                'feedbackOption3': 'C feedback',
                'feedbackOption4': 'D feedback'
            },
            'question3': {
                'column1': 'One',
                'column2': 'Two',
                'row1': '1',
                'row2': '2',
                'answer1': 0,
                'answer2': 3,
                'answerKey': 'row: 1, column: One; row: 2, column: Two;',
                'feedbackCorrect': 'This is correct feedback',
                'feedbackIncorrect': 'This is incorrect feedback'
            },
            'question4': {
                'prompt1': 'A',
                'answer1': 'A',
                'prompt2': 'B',
                'answer2': 'B',
                'distractor': 'C',
                'answerKey': 'prompt: A, answer: A; prompt: B, answer: B;'
            },
            'question5': {
                'prompt1': 'A',
                'answer1': 'A',
                'prompt2': 'B',
                'answer2': 'B',
                'distractor': 'C',
                'answerKey': 'prompt: A, answer: A; prompt: B, answer: B;'
            },
            'question6': {
                'option1': 'A',
                'answerKey': 'A'
            },
            'question7': {
                'option1': '1',
                'answerKey': '1.000000'
            }
        },
        'quiz2': {
            'question1': {
                'column1': 'A',
                'column2': 'B',
                'row1': 'B',
                'row2': 'A',
                'answer1': 1,
                'answer2': 2
            },
            'question2': {
                'prompt1': '1',
                'answer1': 'One',
                'prompt2': '2',
                'answer2': 'Two'
            }
        },
        'quiz3': {
            'question1': {
                'option1': {
                    'exact': '0',
                    'margin': '0'
                },
                'option2': {
                    'exact': '10',
                    'margin': '1'
                },
                'option3': {
                    'rangeMin': '4',
                    'rangeMax': '6'
                },
            }
        },
        'quiz4': {
            'question1': {
                'option1': 'A',
                'option2': 'B',
                'option3': 'C',
                'option4': 'D',
                'answerIndex': 3
            }
        }
    },

    sets: {
        'toBeDeleted': {
            'name': 'Test set',
            'description': 'Test description',
            'subsets': {
                'group1': 'Test subset'
            },
            'quickchecks': {
                'test': 'Test quick check'
            }
        },
        'featuresAllOn' : {
            'name': 'Collection Features All On',
            'subsets': {
                'group1': 'Testing',
                'group2': 'Moved to'
            },
            'quickchecks': {
                'featuresAllOn': 'Assessment Features All On',
                'qtiImportUngraded': 'Assessment QTI Export Research',
                'qtiImportGraded': 'Assessment QTI Export Research 2',
                'custom': 'Test custom'
            }
        },
        'featuresAllOff' : {
            'name': 'Collection Features All Off',
            'subsets': {
                'group1': 'Only group'
            },
            'quickchecks': {
                'urlEmbed': 'External tool url embed with matrix and matching',
                'featuresAllOffPastDue': 'Features are all off and is past due',
                'resultsNotReleased': 'Results not released and no due date'
            }
        },
        'public': {
            'name': 'Public collection',
            'subsets': {
                'group1': 'Only group'
            },
            'quickchecks': {
                'assessment1': 'Only assessment'
            }
        }
    },

    urls: {
        local: {
            setsPage: "localhost:8000/collection"
        },
        canvas: {

        }
    },

    validateNoCorrectMessage: 'A correct answer has not been marked'
};