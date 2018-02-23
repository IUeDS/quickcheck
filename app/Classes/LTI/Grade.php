<?php

namespace App\Classes\LTI;
use App\Models\CollectionFeature;
use Log;
use DateTime;
use DateTimeZone;

class Grade {

    private $attempt;

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    public function __construct($attempt)
    {
        $this->attempt = $attempt;
    }

    /**
    * Based on the collection that an assessment belongs to, is automatic grade passback enabled?
    * Checking the feature that has been set on the collection based on the assessment id in attempt.
    *
    * @return boolean
    */

    public function isGradePassbackEnabled()
    {
        $assessmentId = $this->attempt->getAssessmentId();
        $collectionFeature = new CollectionFeature;
        return $collectionFeature->isGradePassbackEnabled($assessmentId);
    }

    /**
    * Is the attempt ready to be graded? Is it finished, an assignment, and not past due?
    *
    * @return boolean
    */

    public function isReadyForGrade()
    {
        if (!$this->attempt->isComplete()) {
            return false;
        }

        if (!$this->attempt->isTiedToGradebook()) {
            return false;
        }

        if ($this->isPastDue()) {
            return false;
        }

        return true;
    }

    /**
    * Submit a grade to the gradebook
    *
    * @return  boolean (on success/error)
    */

    public function submitGrade()
    {
        $gradePassbackResult = $this->doGradePassback();

        if ($gradePassbackResult !== true) { //explicitly check for true, otherwise, could be error msg
            $logMsg = "A problem was encountered while passing grade back to gradebook for attempt id " .
                $this->id . ". Result: $gradePassbackResult";
            $errorMsg = "A problem was encountered while passing grade to gradebook for attempt id " . $this->id . ". Please try again.";
            Log::error($logMsg);
            abort(500, $errorMsg);
            return false;
        }

        return true;
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * The guts of grade passback; relies on Outcome model. Score is 0-1.
    * Checks that the new score is higher than the existing score in the gradebook.
    *
    * @return boolean (on success/error)
    */

    private function doGradePassback()
    {
        $assessmentId = (string) $this->attempt->getAssessmentId();
        $score = $this->attempt->getCalculatedScore();
        $sourcedID = $this->attempt->getSourcedId();
        $outcome = new Outcome;

        if (!$sourcedID) {
            Log::error('doGradePassback(): lis_result_sourcedid missing from session.');
            return false;
        }

        $gradeToSubmit = $this->formatGradeToSubmit($score);
        if (!$this->isHighestScore($gradeToSubmit, $sourcedID, $outcome)) {
            return true;
        }

        $gradeSendResult = $outcome->sendGrade($sourcedID, $this->attempt, $gradeToSubmit);
        if ($gradeSendResult !== TRUE) {
            return "api.php: doGradePassback() failed. Grade to submit: $gradeToSubmit. Outcome model returned: $gradeSendResult";
        }

        return true;
    }

    /**
    * Format grade to make sure it is a float and is not > 1 on the 0-1 scale
    *
    * @return float $gradeToSubmit
    */

    private function formatGradeToSubmit($score)
    {
        //all grades are on a scale from 0-1, because this is the format required for LTI Outcome grade
        //passback. in some cases, such as an instructor grading, it may be formatted as 0-100. however,
        //the front-end should translate this to be 0-1 before passing to the back-end. consistently
        //across the back-end, score should ONLY be in the 0-1 range. anything else is presentation only.
        $gradeToSubmit = floatval($score);
        //ensure that the grade is not greater than 100% (can happen in construct 2 from double clicking)
        if ($gradeToSubmit > 1) {
            $gradeToSubmit = 1;
        }
        return $gradeToSubmit;
    }

    /**
    * Check to see if the most recent score is higher than existing grade in gradebook
    *
    * @return boolean
    */

    private function isHighestScore($gradeToSubmit, $sourcedID, $outcome)
    {
        $existinggrade = floatval($outcome->readGrade($sourcedID, $this->attempt));
        //E. Scull: A grade of "0" needs to be entered in the gradebook if they earn that score on the first try.
        // A non-existent grade is converted to 0 by floatval().
        // If the existing grade is 0 (i.e., doesn't exist), and the current grade is 0, we still need to submit.
        if (($gradeToSubmit > $existinggrade) || ($existinggrade == 0 && $gradeToSubmit == 0)) {
            return true;
        }

        return false;
    }

    /**
    * Determine if the current attempt is past due or not; no grade passback if past the due date
    * Note: comparison is based on the timezone of the course context in which the attempt was made
    *
    * @return boolean
    */

    private function isPastDue()
    {
        $dueAt = false; //default, in case no due date is set
        $courseTimeZone = $this->attempt->getCourseTimeZone();
        $courseDateTimeZone = new DateTimeZone($courseTimeZone);

        $dueAtValue = $this->attempt->getDueAt();
        if ($dueAtValue) {
            //although due at is saved in database in course-specific timezone,
            //need to still convert, because otherwise, when PHP compares datetimes,
            //it views due at as being in the default timezone, giving incorrect result
            $dueAt = new DateTime($dueAtValue, $courseDateTimeZone);
        }

        //get current time, converted to course-specific timezone (rather than server default)
        $now = new DateTime("now", $courseDateTimeZone);

        // If $dueAt is FALSE, allow grade to be passed back (no due date supplied)
        if (!$dueAt || $now <= $dueAt) {
            return false;
        }

        return true;
    }
}
