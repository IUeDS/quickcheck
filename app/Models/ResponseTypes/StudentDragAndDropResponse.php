<?php

namespace App\Models\ResponseTypes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Classes\StudentResponses\StudentResponseTypeInterface as StudentResponseType;
use App\Models\StudentResponse;

class StudentDragAndDropResponse extends StudentResponseType
{
    use HasFactory;

    protected $fillable = [
        'student_response_id',
        'droppable_answer_id',
        'draggable_answer_id'
    ];
    protected $casts = [
        'student_response_id' => 'integer',
        'droppable_answer_id' => 'integer',
        'draggable_answer_id' => 'integer'
    ];
    private $RESPONSE_TYPE = 'drag_and_drop_responses';
    private $QUESTION_TYPE = 'drag_and_drop';
    private $DRAGGABLE_ID = 'draggable_answer_id';
    private $DROPPABLE_ID = 'droppable_answer_id';

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

        $response['answer'] = $this->parseDragAndDropResponseForExport($selectedAnswers);
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
        $responses = $studentResponse[$this->RESPONSE_TYPE];
        $optionIds = [];
        foreach($responses as $response) {
            $droppableId = $response[$this->DROPPABLE_ID];
            $draggableId = $response[$this->DRAGGABLE_ID];
            $optionSelected = ['primary' => $droppableId, 'paired' => $draggableId];
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
        $responses = $studentResponse[$this->RESPONSE_TYPE];
        $optionId = $responses[0][$this->DRAGGABLE_ID]; //we had to have had at least one response to get here
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
        foreach ($studentAnswer['drag_and_drop_answers'] as $answer) {
            $response = new StudentDragAndDropResponse;
            $response->student_response_id = $studentResponse->id;
            $response->draggable_answer_id = $answer['draggable_id'];
            $response->droppable_answer_id = $answer['droppable_id'];
            $response->save();
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
        $optionId = $selectedAnswers[0][$this->DROPPABLE_ID];
        $this->answerDictionary->addQuestionToResponse($response, $optionId, $this->QUESTION_TYPE);
    }

    /**
    * Translate the response answer into plain text for a CSV export
    *
    * @param  []  $selectedAnswers
    * @return string
    */

    private function parseDragAndDropResponseForExport($selectedAnswers) {
        return 'Invalid: drag and drop questions cannot be exported in plain text format for CSV.';
    }
}
