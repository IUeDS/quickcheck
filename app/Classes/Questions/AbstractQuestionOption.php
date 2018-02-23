<?php

namespace App\Classes\Questions;

use App\Classes\Analytics\ResponseAnalytics as ResponseAnalytics;
use Illuminate\Database\Eloquent\Model as Eloquent;
use App\Models\AnswerTypes\MCAnswer;
use App\Models\AnswerTypes\MatchingAnswer;
use App\Models\AnswerTypes\DropdownAnswer;
use App\Models\AnswerTypes\MatrixAnswer;
use App\Models\AnswerTypes\NumericalAnswer;
use App\Models\AnswerTypes\TextMatchAnswer;

abstract class AbstractQuestionOption extends Eloquent
{

    abstract public function checkAnswer($questionId, $studentAnswer);
    abstract public function getOptionsForQuestion($questionId, $noAnswers);
    abstract public function incrementAnalytics($optionIds);
    abstract public function initializeOption($noAnswers);
    abstract public function saveQuestionOptions($question, $updatedQuestion);
    abstract public function search($searchTerm);
    abstract public function setAnalyticsPercentage();

    //define eloquent relationship
    public function question()
    {
        return $this->belongsTo('Question');
    }

    public static function getAnswerModelFromQuestionType($questionType)
    {
        switch($questionType) {
            case config('constants.questionTypes.MULTCHOICE'):
                return new MCAnswer();
            case config('constants.questionTypes.MULTCORRECT'):
                return new MCAnswer();
            case config('constants.questionTypes.MATCHING'):
                return new MatchingAnswer();
            case config('constants.questionTypes.DROPDOWN'):
                return new DropdownAnswer();
            case config('constants.questionTypes.MATRIX'):
                return new MatrixAnswer();
            case config('constants.questionTypes.NUMERICAL'):
                return new NumericalAnswer();
            case config('constants.questionTypes.TEXTMATCH'):
                return new TextMatchAnswer();
            default:
                return false;
        }
    }

    public function setResponseAnalytics($questionAnalytics)
    {
        $this->responseAnalytics = new ResponseAnalytics($questionAnalytics);
    }

    public function isNewOption($id)
    {
        if (strpos($id, 'temp')) {
            return true;
        }

        return false;
    }

    //in most cases, just a simple replication, but this function can be over-ridden
    //in more complicated circumstances, such as multiple choice options where custom
    //feedback per each option may be present.
    public function copy($questionId)
    {
        $newOption = $this->replicate();
        $newOption->question_id = $questionId;
        $newOption->save();
    }
}