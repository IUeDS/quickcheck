<?php
namespace App\Classes\Analytics;

class ResponseAnalytics {

    public $countAnswered;
    public $percentSelected;
    public $questionAnalytics;

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    public function __construct($questionAnalytics) {
        $this->countAnswered = 0;
        $this->percentSelected = 0;
        $this->questionAnalytics = $questionAnalytics;
    }

    /**
    * Calculate number of students who selected this option out of total who answered the question
    *
    * @return void
    */

    public function calculatePercentage() {
        $questionCountAnswered = $this->questionAnalytics->getCountAnswered();
        if ($questionCountAnswered === 0) { //prevent division by 0 error
            $this->percentSelected = 0;
        }
        else {
            $percentSelected = $this->countAnswered / $questionCountAnswered * 100;
            $this->percentSelected = round($percentSelected, 0);
        }
    }

    /**
    * Increment number of students who selected this answer option
    *
    * @return void
    */

    public function increment() {
        $this->countAnswered++;
    }
}
