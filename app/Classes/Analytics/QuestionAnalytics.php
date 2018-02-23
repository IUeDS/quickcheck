<?php
namespace App\Classes\Analytics;

class QuestionAnalytics {
    public $countAnswered;
    public $countAnsweredCorrect;
    public $correctPercentage;
    public $otherResponses;

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    public function __construct() {
        $this->countAnswered = 0;
        $this->countAnsweredCorrect = 0;
        $this->correctPercentage = 0;
        $this->otherResponses = [];
    }

    /**
    * For textmatch/numerical, add non-correct responses to an array
    *
    * @param  StudentResponse  $response
    * @return void
    */

    public function addToOtherResponses($response) {
        array_push($this->otherResponses, $response);
    }

    /**
    * Calculate percentage of students who answered this question correctly
    *
    * @return void
    */

    public function calculatePercentage() {
        if ($this->countAnswered === 0) { //prevent division by 0 error
            $this->correctPercentage = 0;
        }
        else {
            $percentCorrect = $this->countAnsweredCorrect / $this->countAnswered * 100;
            $this->correctPercentage = round($percentCorrect, 0);
        }
    }

    /**
    * Get the number of students who answered this question
    *
    * @return int $countAnswered
    */

    public function getCountAnswered() {
        return $this->countAnswered;
    }

    /**
    * Increment the number of times a student has answered this question
    *
    * @param  bool  $isCorrect
    * @return void
    */

    public function increment($isCorrect) {
        $this->countAnswered++;
        if ($isCorrect) {
            $this->countAnsweredCorrect++;
        }
    }
}
