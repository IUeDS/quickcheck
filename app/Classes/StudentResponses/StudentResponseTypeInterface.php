<?php

namespace App\Classes\StudentResponses;
use App\Classes\Questions\AnswerDictionary;
use Illuminate\Database\Eloquent\Model as Eloquent;

abstract class StudentResponseTypeInterface extends Eloquent {

    protected $answerDictionary;

    abstract public function saveAnswer($studentResponse, $studentAnswer, $questionId);
    abstract public function buildResponseExport($studentResponse, $attempt, $answerDictionary);
    abstract public function getQuestionIdFromResponse($studentResponse);
    abstract public function getOptionIdsFromResponse($studentResponse, $question);

    public function studentResponse() {
        return $this->belongsTo('StudentResponse');
    }

    public function setAnswerDictionary($answerDictionary) {
        $this->answerDictionary = $answerDictionary;
    }
}