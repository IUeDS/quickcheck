<?php
namespace App\Models\ResponseTypes;
use App\Classes\StudentResponses\StudentResponseTypeInterface as StudentResponseType;
use App\Models\StudentResponse;

class StudentMcResponse extends StudentResponseType {
    protected $table = 'student_mc_responses';
    protected $fillable = [
        'student_response_id',
        'mc_answer_id'
    ];
    private $RESPONSE_TYPE = 'mc_responses';
    private $MC_QUESTION_TYPE = 'multiple_choice';
    private $MCORRECT_QUESTION_TYPE = 'multiple_correct';
    private $ANSWER_ID = 'mc_answer_id';
    private $ANSWER_FIELD = 'answer_text';

    public function MCAnswer() {
        //specify foreign, then local key, since the caps might throw off automagic foreign key relationship
        return $this->hasOne('App\Models\AnswerTypes\MCAnswer', 'id', 'mc_answer_id');
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

        //just for multiple choice/correct, since they use the same model, need to determine which one
        $questionType = $this->getQuestionType($selectedAnswers);

        if ($questionType === $this->MC_QUESTION_TYPE) {
            $response['answer'] = $this->parseMcResponseForExport($selectedAnswers);
        }
        else {
            $response['answer'] = $this->parseMcorrectResponseForExport($selectedAnswers);
        }

        $this->addQuestionToExport($selectedAnswers, $response, $questionType);
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
        $mcResponses = $studentResponse[$this->RESPONSE_TYPE];
        $optionIds = [];
        //pretty straight-forward here since there's no pairing, just a single primary
        foreach($mcResponses as $mcResponse) {
            $answerId = $mcResponse[$this->ANSWER_ID];
            $optionSelected = ['primary' => $answerId];
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
        $mcResponses = $studentResponse[$this->RESPONSE_TYPE];
        //just for multiple choice/correct, since they use the same model, need to determine which one
        $questionType = $this->getQuestionType($mcResponses);
        $optionId = $mcResponses[0][$this->ANSWER_ID]; //we had to have had at least one response to get here
        $questionId = $this->answerDictionary->getQuestionIdFromOption($optionId, $questionType);
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
        //multiple choice
        if (array_key_exists('mc_answer_id', $studentAnswer)) {
            $this->student_response_id = $studentResponse->id;
            $this->mc_answer_id = $studentAnswer['mc_answer_id'];
            $this->save();
        }
        //multiple correct
        else if (array_key_exists('mcorrect_answer_ids', $studentAnswer)) {
            foreach ($studentAnswer['mcorrect_answer_ids'] as $mcorrectAnswerId) {
                $studentMcResponse = new StudentMcResponse;
                $studentMcResponse->student_response_id = $studentResponse->id;
                $studentMcResponse->mc_answer_id = $mcorrectAnswerId;
                $studentMcResponse->save();
            }
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

    private function addQuestionToExport($selectedAnswers, &$response, $questionType) {
        $optionId = $selectedAnswers[0][$this->ANSWER_ID];
        $this->answerDictionary->addQuestionToResponse($response, $optionId, $questionType);
    }

    /**
    * Get the question type (multiple choice or multiple correct) based on student response
    *
    * @param  []  $selectedAnswers
    * @return string
    */

    private function getQuestionType($selectedAnswers) {
        $optionId = $selectedAnswers[0][$this->ANSWER_ID];
        $answerFound = $this->answerDictionary->doesAnswerExist($optionId, $this->MC_QUESTION_TYPE);
        if ($answerFound) {
            return $this->MC_QUESTION_TYPE;
        }
        return $this->MCORRECT_QUESTION_TYPE;
    }

    /**
    * Translate a multiple correct response answer into plain text for a CSV export
    *
    * @param  []  $selectedAnswers
    * @return string
    */

    private function parseMcorrectResponseForExport($selectedAnswers) {
        $answer = '';
        foreach($selectedAnswers as $selectedAnswer) {
            $optionId = $selectedAnswer[$this->ANSWER_ID];
            $answerText = $this->answerDictionary->getAnswer($optionId, $this->MCORRECT_QUESTION_TYPE, $this->ANSWER_FIELD);
            $answerText .= '; '; //delimiter between multiple options selected
            $answer .= $answerText;
        }
        return $answer;
    }

    /**
    * Translate a multple choice response answer into plain text for a CSV export
    *
    * @param  []  $selectedAnswers
    * @return string
    */

    private function parseMcResponseForExport($selectedAnswers) {
        $optionId = $selectedAnswers[0][$this->ANSWER_ID]; //for multiple choice, only one option can be selected
        return $this->answerDictionary->getAnswer($optionId, $this->MC_QUESTION_TYPE, $this->ANSWER_FIELD);
    }
}
