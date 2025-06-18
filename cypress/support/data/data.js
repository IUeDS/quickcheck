const { homePage } = require("../pages/homePage");

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
    instructorLocalUsername: 'testinstructor',
    instructorInviteUsername: 'edstest1',

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
        localRoot: 'localhost:8000',
        local: {
            homePage: "localhost:8000",
            setPage: "localhost:8000/collection/1",
            setsPage: "localhost:8000/collection",
            qcEditPage: "localhost:8000/assessment/1/edit",
            qcPreviewPage: "localhost:8000/assessment/1?preview=true",
        },
        canvas: {

        },
        testEndpoints: {
            refresh: '/api/test/refresh',
            newSet: '/api/test/newSet',
            newAssessment: '/api/test/newAssessment',
            testAssessments: '/api/test/testAssessments'
        }
    },

    validateNoCorrectMessage: 'A correct answer has not been marked',

    allQuestionTypesData: {
        "assessment": {
            "id": 1,
            "assessment_group_id": "1",
            "name": "All question types",
            "title": "",
            "description": "",
            "shuffled": "false",
            "custom_activity_id": null,
            "created_at": "2025-05-26T16:26:18.000000Z",
            "updated_at": "2025-05-26T16:26:18.000000Z",
            "deleted_at": null,
            "assessment_group": {
                "id": 1,
                "collection_id": 1,
                "name": "Test subset",
                "created_at": "2025-04-22T15:16:39.000000Z",
                "updated_at": "2025-04-22T15:16:39.000000Z",
                "deleted_at": null,
                "collection": {
                    "id": 1,
                    "name": "Test set",
                    "owner": "testinstructor",
                    "public_collection": "false",
                    "description": null,
                    "created_at": "2025-04-22T15:16:39.000000Z",
                    "updated_at": "2025-04-22T15:16:39.000000Z",
                    "deleted_at": null,
                    "assessment_groups": [
                        {
                            "id": 1,
                            "collection_id": 1,
                            "name": "Test subset",
                            "created_at": "2025-04-22T15:16:39.000000Z",
                            "updated_at": "2025-04-22T15:16:39.000000Z",
                            "deleted_at": null
                        }
                    ]
                }
            },
            "custom_activity": null,
            "questions": [
                {
                    "id": "11748276836764-temp",
                    "question_order": 1,
                    "question_text": "<div>\n<div>Answer is B</div>\n</div>",
                    "question_type": "multiple_choice",
                    "randomized": "false",
                    "multiple_correct": "false",
                    "options": [
                        {
                            "id": "11748276836780-temp",
                            "question_id": "11748276836764-temp",
                            "answer_text": "A",
                            "correct": "false",
                            "mc_option_feedback": {
                                "mc_answer_id": "11748276836780-temp",
                                "feedback_text": "A feedback"
                            }
                        },
                        {
                            "id": "21748276836780-temp",
                            "question_id": "11748276836764-temp",
                            "answer_text": "B",
                            "correct": "true",
                            "mc_option_feedback": {
                                "mc_answer_id": "21748276836780-temp",
                                "feedback_text": "B feedback"
                            }
                        },
                        {
                            "id": "31748276836780-temp",
                            "question_id": "11748276836764-temp",
                            "answer_text": "C",
                            "correct": "false",
                            "mc_option_feedback": {
                                "mc_answer_id": "31748276836780-temp",
                                "feedback_text": "C feedback"
                            }
                        },
                        {
                            "id": "41748276836780-temp",
                            "question_id": "11748276836764-temp",
                            "answer_text": "D",
                            "correct": "false",
                            "mc_option_feedback": {
                                "mc_answer_id": "41748276836780-temp",
                                "feedback_text": "D feedback"
                            }
                        }
                    ],
                    "validationError": false,
                    "question_feedback": []
                },
                {
                    "id": "21748276888973-temp",
                    "question_order": 2,
                    "question_text": "<p>A and B correct</p>",
                    "question_type": "multiple_correct",
                    "randomized": "false",
                    "multiple_correct": "false",
                    "options": [
                        {
                            "id": "11748276889121-temp",
                            "question_id": "21748276888973-temp",
                            "answer_text": "A",
                            "correct": "true",
                            "mc_option_feedback": {
                                "mc_answer_id": "11748276889121-temp",
                                "feedback_text": "A feedback"
                            }
                        },
                        {
                            "id": "21748276889121-temp",
                            "question_id": "21748276888973-temp",
                            "answer_text": "B",
                            "correct": "true",
                            "mc_option_feedback": {
                                "mc_answer_id": "21748276889121-temp",
                                "feedback_text": "B feedback"
                            }
                        },
                        {
                            "id": "31748276889121-temp",
                            "question_id": "21748276888973-temp",
                            "answer_text": "C",
                            "correct": "false",
                            "mc_option_feedback": {
                                "mc_answer_id": "31748276889121-temp",
                                "feedback_text": "C feedback"
                            }
                        },
                        {
                            "id": "41748276889121-temp",
                            "question_id": "21748276888973-temp",
                            "answer_text": "D",
                            "correct": "false",
                            "mc_option_feedback": {
                                "mc_answer_id": "41748276889121-temp",
                                "feedback_text": "D feedback"
                            }
                        }
                    ],
                    "validationError": false,
                    "question_feedback": []
                },
                {
                    "id": "31748277017590-temp",
                    "question_order": 3,
                    "question_text": "",
                    "question_type": "matrix",
                    "randomized": "false",
                    "multiple_correct": "false",
                    "validationError": false,
                    "question_feedback": [
                        {
                            "question_id": "31748277017590-temp",
                            "feedback_text": "This is correct feedback",
                            "correct": "true"
                        },
                        {
                            "question_id": "31748277017590-temp",
                            "feedback_text": "This is incorrect feedback",
                            "correct": "false"
                        }
                    ],
                    "columns": [
                        {
                            "id": "1-temp",
                            "question_id": "31748277017590-temp",
                            "answer_text": "One",
                            "row_or_column": "column"
                        },
                        {
                            "id": "2-temp",
                            "question_id": "31748277017590-temp",
                            "answer_text": "Two",
                            "row_or_column": "column"
                        }
                    ],
                    "rows": [
                        {
                            "id": "1-temp",
                            "question_id": "31748277017590-temp",
                            "answer_text": "1",
                            "row_or_column": "row",
                            "matrix_answer_text": "",
                            "columnAnswerId": "1-temp"
                        },
                        {
                            "id": "2-temp",
                            "question_id": "31748277017590-temp",
                            "answer_text": "2",
                            "row_or_column": "row",
                            "matrix_answer_text": "",
                            "columnAnswerId": "2-temp"
                        }
                    ]
                },
                {
                    "id": "41748277061865-temp",
                    "question_order": 4,
                    "question_text": "",
                    "question_type": "matching",
                    "randomized": "false",
                    "multiple_correct": "false",
                    "options": [
                        {
                            "id": "1-temp",
                            "question_id": "41748277061865-temp",
                            "option_text": "A",
                            "prompt_or_answer": "prompt",
                            "matching_answer_text": "A"
                        },
                        {
                            "id": "2-temp",
                            "question_id": "41748277061865-temp",
                            "option_text": "B",
                            "prompt_or_answer": "prompt",
                            "matching_answer_text": "B"
                        },
                        {
                            "id": "3-temp",
                            "question_id": "41748277061865-temp",
                            "option_text": "C",
                            "prompt_or_answer": "answer",
                            "matching_answer_text": ""
                        }
                    ],
                    "validationError": false,
                    "question_feedback": [],
                    "prompts": [
                        {
                            "id": "1-temp",
                            "question_id": "41748277061865-temp",
                            "option_text": "A",
                            "prompt_or_answer": "prompt",
                            "matching_answer_text": "A"
                        },
                        {
                            "id": "2-temp",
                            "question_id": "41748277061865-temp",
                            "option_text": "B",
                            "prompt_or_answer": "prompt",
                            "matching_answer_text": "B"
                        }
                    ],
                    "selectableAnswers": [],
                    "distractors": [
                        {
                            "id": "3-temp",
                            "question_id": "41748277061865-temp",
                            "option_text": "C",
                            "prompt_or_answer": "answer",
                            "matching_answer_text": ""
                        }
                    ]
                },
                {
                    "id": "51748277128044-temp",
                    "question_order": 5,
                    "question_text": "",
                    "question_type": "dropdown",
                    "randomized": "true",
                    "multiple_correct": "false",
                    "options": [
                        {
                            "id": "1-temp",
                            "question_id": "51748277128044-temp",
                            "answer_text": "A",
                            "prompt_or_answer": "prompt",
                            "dropdown_answer_text": "A",
                            "answer_order": 1
                        },
                        {
                            "id": "2-temp",
                            "question_id": "51748277128044-temp",
                            "answer_text": "B",
                            "prompt_or_answer": "prompt",
                            "dropdown_answer_text": "B",
                            "answer_order": 2
                        },
                        {
                            "id": "3-temp",
                            "question_id": "51748277128044-temp",
                            "answer_text": "C",
                            "prompt_or_answer": "answer",
                            "dropdown_answer_text": ""
                        }
                    ],
                    "validationError": false,
                    "question_feedback": [],
                    "prompts": [
                        {
                            "id": "1-temp",
                            "question_id": "51748277128044-temp",
                            "answer_text": "A",
                            "prompt_or_answer": "prompt",
                            "dropdown_answer_text": "A",
                            "answer_order": 1
                        },
                        {
                            "id": "2-temp",
                            "question_id": "51748277128044-temp",
                            "answer_text": "B",
                            "prompt_or_answer": "prompt",
                            "dropdown_answer_text": "B",
                            "answer_order": 2
                        }
                    ],
                    "selectableAnswers": [],
                    "distractors": [
                        {
                            "id": "3-temp",
                            "question_id": "51748277128044-temp",
                            "answer_text": "C",
                            "prompt_or_answer": "answer",
                            "dropdown_answer_text": ""
                        }
                    ]
                },
                {
                    "id": "61748277149254-temp",
                    "question_order": 6,
                    "question_text": "",
                    "question_type": "textmatch",
                    "randomized": "true",
                    "multiple_correct": "false",
                    "options": [
                        {
                            "id": "1-temp",
                            "question_id": "61748277149254-temp",
                            "textmatch_answer_text": "A"
                        }
                    ],
                    "validationError": false,
                    "question_feedback": []
                },
                {
                    "id": "71748277163516-temp",
                    "question_order": 7,
                    "question_text": "",
                    "question_type": "numerical",
                    "randomized": "true",
                    "multiple_correct": "false",
                    "options": [
                        {
                            "id": "1-temp",
                            "answer_type": "exact",
                            "numerical_answer": 1,
                            "margin_of_error": 0,
                            "range_min": null,
                            "range_max": null
                        }
                    ],
                    "validationError": false,
                    "question_feedback": []
                }
            ]
        }
    },

    multipleChoiceData: {
        "assessment": {
          "id": 2,
          "assessment_group_id": "1",
          "name": "1 MC",
          "title": "",
          "description": "",
          "shuffled": "false",
          "custom_activity_id": null,
          "created_at": "2025-06-09T17:39:55.000000Z",
          "updated_at": "2025-06-09T17:39:55.000000Z",
          "deleted_at": null,
          "assessment_group": {
            "id": 1,
            "collection_id": 1,
            "name": "All question types subset",
            "created_at": "2025-05-26T20:48:01.000000Z",
            "updated_at": "2025-05-26T20:48:01.000000Z",
            "deleted_at": null,
            "collection": {
              "id": 1,
              "name": "All question types set",
              "owner": "testinstructor",
              "public_collection": "false",
              "description": null,
              "created_at": "2025-05-26T20:48:01.000000Z",
              "updated_at": "2025-05-26T20:48:01.000000Z",
              "deleted_at": null,
              "assessment_groups": [
                {
                  "id": 1,
                  "collection_id": 1,
                  "name": "All question types subset",
                  "created_at": "2025-05-26T20:48:01.000000Z",
                  "updated_at": "2025-05-26T20:48:01.000000Z",
                  "deleted_at": null
                }
              ]
            }
          },
          "custom_activity": null,
          "questions": [
            {
              "id": "11749490806071-temp",
              "question_order": 1,
              "question_text": "<p>Answer is true</p>",
              "question_type": "multiple_choice",
              "randomized": "false",
              "multiple_correct": "false",
              "options": [
                {
                  "id": "11749490806090-temp",
                  "question_id": "11749490806071-temp",
                  "answer_text": "True",
                  "correct": "true"
                },
                {
                  "id": "21749490806090-temp",
                  "question_id": "11749490806071-temp",
                  "answer_text": "False",
                  "correct": "false"
                }
              ],
              "validationError": false,
              "question_feedback": []
            }
          ]
        }
      },

      numericalData: {
        "assessment": {
          "id": 3,
          "assessment_group_id": "1",
          "name": "Numerical",
          "title": "",
          "description": "",
          "shuffled": "false",
          "custom_activity_id": null,
          "created_at": "2025-06-09T17:48:25.000000Z",
          "updated_at": "2025-06-09T17:48:25.000000Z",
          "deleted_at": null,
          "assessment_group": {
            "id": 1,
            "collection_id": 1,
            "name": "All question types subset",
            "created_at": "2025-05-26T20:48:01.000000Z",
            "updated_at": "2025-05-26T20:48:01.000000Z",
            "deleted_at": null,
            "collection": {
              "id": 1,
              "name": "All question types set",
              "owner": "testinstructor",
              "public_collection": "false",
              "description": null,
              "created_at": "2025-05-26T20:48:01.000000Z",
              "updated_at": "2025-05-26T20:48:01.000000Z",
              "deleted_at": null,
              "assessment_groups": [
                {
                  "id": 1,
                  "collection_id": 1,
                  "name": "All question types subset",
                  "created_at": "2025-05-26T20:48:01.000000Z",
                  "updated_at": "2025-05-26T20:48:01.000000Z",
                  "deleted_at": null
                }
              ]
            }
          },
          "custom_activity": null,
          "questions": [
            {
              "id": "11749491308163-temp",
              "question_order": 1,
              "question_text": "",
              "question_type": "numerical",
              "randomized": "true",
              "multiple_correct": "false",
              "options": [
                {
                  "id": "1-temp",
                  "answer_type": "exact",
                  "numerical_answer": 0,
                  "margin_of_error": 0,
                  "range_min": null,
                  "range_max": null
                },
                {
                  "id": "2-temp",
                  "answer_type": "exact",
                  "numerical_answer": 10,
                  "margin_of_error": 1,
                  "range_min": null,
                  "range_max": null
                },
                {
                  "id": "3-temp",
                  "answer_type": "range",
                  "numerical_answer": "",
                  "margin_of_error": 0,
                  "range_min": 4,
                  "range_max": 6
                }
              ],
              "validationError": false,
              "question_feedback": []
            }
          ]
        }
      }
};