<?php
namespace App\Models\ResponseTypes;
use App\Classes\StudentResponses\StudentResponseTypeInterface as StudentResponseType;
use App\Models\StudentResponse;

class StudentDropdownResponse extends StudentResponseType {
    protected $table = 'student_dropdown_responses';
    protected $fillable = [
        'student_response_id',
        'dropdown_prompt_id',
        'dropdown_answer_id'
    ];
    private $RESPONSE_TYPE = 'dropdown_responses';
    private $QUESTION_TYPE = 'dropdown';
    private $PROMPT_ID = 'dropdown_prompt_id';
    private $ANSWER_ID = 'dropdown_answer_id';
    private $TEXT_FIELD = 'answer_text';

    public function dropdownPrompt() {
        //specify foreign, then local key, since prompt/answer are not in the table name for dropdown_answers
        return $this->hasOne('App\Models\AnswerTypes\DropdownAnswer', 'id', 'dropdown_prompt_id');
    }

    public function dropdownAnswer() {
        //specify foreign, then local key, since prompt/answer are not in the table name for dropdown_answers
        return $this->hasOne('App\Models\AnswerTypes\DropdownAnswer', 'id', 'dropdown_answer_id');
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

        $response['answer'] = $this->parseDropdownResponseForExport($selectedAnswers);
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
        $dropdownResponses = $studentResponse[$this->RESPONSE_TYPE];
        $optionIds = [];
        foreach($dropdownResponses as $dropdownResponse) {
            $promptId = $dropdownResponse[$this->PROMPT_ID];
            $answerId = $dropdownResponse[$this->ANSWER_ID];
            $optionSelected = ['primary' => $promptId, 'paired' => $answerId];
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
        $dropdownResponses = $studentResponse[$this->RESPONSE_TYPE];
        $optionId = $dropdownResponses[0][$this->ANSWER_ID]; //we had to have had at least one response to get here
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
        foreach ($studentAnswer['dropdown_answers'] as $dropdownAnswer) {
            $dropdownResponse = new StudentDropdownResponse;
            $dropdownResponse->student_response_id = $studentResponse->id;
            $dropdownResponse->dropdown_prompt_id = $dropdownAnswer['prompt_id'];
            $dropdownResponse->dropdown_answer_id = $dropdownAnswer['answer_id'];
            $dropdownResponse->save();
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
        $optionId = $selectedAnswers[0][$this->ANSWER_ID];
        $this->answerDictionary->addQuestionToResponse($response, $optionId, $this->QUESTION_TYPE);
    }

    /**
    * Translate the response answer into plain text for a CSV export
    *
    * @param  []  $selectedAnswers
    * @return string
    */

    private function parseDropdownResponseForExport($selectedAnswers) {
        $answer = '';
        foreach ($selectedAnswers as $selectedAnswer) {
            $promptId = $selectedAnswer[$this->PROMPT_ID];
            $optionId = $selectedAnswer[$this->ANSWER_ID];
            $prompt = $this->answerDictionary->getAnswer($promptId, $this->QUESTION_TYPE, $this->TEXT_FIELD);
            $option = $this->answerDictionary->getAnswer($optionId, $this->QUESTION_TYPE, $this->TEXT_FIELD);
            $answer .= 'prompt: ' . $prompt . ', answer: ' . $option . '; ';
        }
        return $answer;
    }
}
