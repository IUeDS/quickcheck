<?php
namespace App\Models\ResponseTypes;
use App\Classes\StudentResponses\StudentResponseTypeInterface as StudentResponseType;
use App\Models\StudentResponse;

class StudentMatrixResponse extends StudentResponseType {
    protected $table = 'student_matrix_responses';
    protected $fillable = [
        'student_response_id',
        'matrix_row_id',
        'matrix_column_id'
    ];
    private $RESPONSE_TYPE = 'matrix_responses';
    private $QUESTION_TYPE = 'matrix';
    private $ROW_ID = 'matrix_row_id';
    private $COLUMN_ID = 'matrix_column_id';
    private $TEXT_FIELD = 'answer_text';

    public function matrixRow() {
        //specify foreign, then local key, since row/column are not in the table name for matrix_answers
        return $this->hasOne('App\Models\AnswerTypes\MatrixAnswer', 'id', 'matrix_row_id');
    }

    public function matrixColumn() {
        //specify foreign, then local key, since row/column are not in the table name for matrix_answers
        return $this->hasOne('App\Models\AnswerTypes\MatrixAnswer', 'id', 'matrix_column_id');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Build CSV export array for a student's response
    *
    * @param  []               $studentResponse
    * @param  Attempt          $attempt
    * @param  AnswerDictionary $answerDiciontary
    * @return []
    */

    public function buildResponseExport($studentResponse, $attempt, $answerDictionary) {
        $this->answerDictionary = $answerDictionary;
        $response = StudentResponse::addGeneralInfoToResponse($studentResponse, $attempt);
        $selectedAnswers = $studentResponse[$this->RESPONSE_TYPE];

        $response['answer'] = $this->parseMatrixResponseForExport($selectedAnswers);
        $this->addQuestionToExport($selectedAnswers, $response);
        return $response;
    }

    /**
    * Determined associated option IDs from student response
    *
    * @param  []        $studentResponse
    * @param  Question  $question
    * @return []
    */

    public function getOptionIdsFromResponse($studentResponse, $question) {
        $matrixResponses = $studentResponse[$this->RESPONSE_TYPE];
        $optionIds = [];
        foreach($matrixResponses as $matrixResponse) {
            $rowId = $matrixResponse[$this->ROW_ID];
            $columnId = $matrixResponse[$this->COLUMN_ID];
            $optionSelected = ['primary' => $rowId, 'paired' => $columnId];
            array_push($optionIds, $optionSelected);
        }
        return $optionIds;
    }

    /**
    * Determined associated question ID from student response
    *
    * @param  [] $studentResponse
    * @return int
    */

    public function getQuestionIdFromResponse($studentResponse) {
        $matrixResponses = $studentResponse[$this->RESPONSE_TYPE];
        $optionId = $matrixResponses[0][$this->ROW_ID]; //we had to have had at least one response to get here
        $questionId = $this->answerDictionary->getQuestionIdFromOption($optionId, $this->QUESTION_TYPE);
        return $questionId;
    }

    /**
    * Save a student's answer
    *
    * @param  StudentResponse  $studentResponse
    * @param  []               $studentAnswer
    * @param  int              $questionId
    * @return void
    */

    public function saveAnswer($studentResponse, $studentAnswer, $questionId) {
        foreach ($studentAnswer['matrix_answers'] as $matrixAnswer) {
            $matrixResponse = new StudentMatrixResponse;
            $matrixResponse->student_response_id = $studentResponse->id;
            $matrixResponse->matrix_row_id = $matrixAnswer['row_id'];
            $matrixResponse->matrix_column_id = $matrixAnswer['column_id'];
            $matrixResponse->save();
        }
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Add general question information to an exported CSV response row
    *
    * @param  []  $selectedAnswers
    * @param  []  $response
    * @return void
    */

    private function addQuestionToExport($selectedAnswers, &$response) {
        $optionId = $selectedAnswers[0][$this->ROW_ID];
        $this->answerDictionary->addQuestionToResponse($response, $optionId, $this->QUESTION_TYPE);
    }

    /**
    * Translate the response answer into plain text for a CSV export
    *
    * @param  []  $selectedAnswers
    * @return string
    */

    private function parseMatrixResponseForExport($selectedAnswers) {
        $answer = '';
        foreach ($selectedAnswers as $selectedAnswer) {
            $rowId = $selectedAnswer[$this->ROW_ID];
            $columnId = $selectedAnswer[$this->COLUMN_ID];
            $rowAnswer = $this->answerDictionary->getAnswer($rowId, $this->QUESTION_TYPE, $this->TEXT_FIELD);
            $columnAnswer = $this->answerDictionary->getAnswer($columnId, $this->QUESTION_TYPE, $this->TEXT_FIELD);
            $answer .= 'row: ' . $rowAnswer . ', column: ' . $columnAnswer . '; ';
        }
        return $answer;
    }
}
