<?php
namespace App\Models\ResponseTypes;
use App\Classes\StudentResponses\StudentResponseTypeInterface as StudentResponseType;
use App\Models\StudentResponse;
use App\Models\AnswerTypes\TextMatchAnswer;

class StudentTextmatchResponse extends StudentResponseType {
    protected $table = 'student_textmatch_responses';
    protected $fillable = [
        'student_response_id',
        'student_answer_text',
        'question_id'
    ];
    private $RESPONSE_TYPE = 'textmatch_responses';
    private $TEXT_FIELD = 'student_answer_text';
    private $QUESTION_TYPE = 'textmatch';

    public function question() {
        return $this->belongsTo('App\Models\Question');
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
        $response['answer'] = $selectedAnswers[0][$this->TEXT_FIELD];
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
        $textmatchResponses = $studentResponse[$this->RESPONSE_TYPE];
        //since we can't key directly to the correct answers (students are obviously allowed to enter text
        //that is NOT correct, and thus not in the table), we have to get the correct answers and compare
        //to see if the student answered with an existing option; otherwise, tack it on to otherAnswers array
        $optionIds = [];
        foreach($textmatchResponses as $textmatchResponse) {
            $answerFound = false;
            $studentAnswer = $textmatchResponse[$this->TEXT_FIELD];
            $formattedStudentAnswer = TextMatchAnswer::formatAnswer($studentAnswer);
            foreach ($question->options as $option) {
                $answerText = TextMatchAnswer::formatAnswer($option->textmatch_answer_text);
                if ($answerText === $formattedStudentAnswer) {
                    $answerFound = true;
                    $answerId = $option->id;
                    $optionSelected = ['primary' => $answerId];
                    array_push($optionIds, $optionSelected);
                }
            }
            if (!$answerFound) {
                $question->addOtherResponseToAnalytics($studentAnswer);
            }
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
        $textmatchResponses = $studentResponse[$this->RESPONSE_TYPE];
        $questionId = $textmatchResponses[0]['question_id']; //we had to have had at least one response to get here
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
        $this->student_response_id = $studentResponse->id;
        $this->student_answer_text = $studentAnswer['textmatch_answer'];
        $this->question_id = $questionId;
        $this->save();
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
        $questionId = $selectedAnswers[0]['question_id'];
        $this->answerDictionary->addQuestionToResponse($response, null, $this->QUESTION_TYPE, $questionId);
    }
}