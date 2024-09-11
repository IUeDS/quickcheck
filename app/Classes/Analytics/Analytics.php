<?php

namespace App\Classes\Analytics;
use App\Classes\Questions\AnswerDictionary;
use App\Models\Question;
use App\Models\Attempt;
use App\Models\CourseContext;
use App\Models\StudentResponse;
use App\Models\Assessment;

class Analytics {
    private $answerDictionary;
    private $assessmentAnalytics = [];
    private $attempts = [];
    private $questions = [];
    private $responseTypes = [];
    private $studentAnalytics;

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Return all analytics for an assessment in an LTI context
    *
    * @param  int     $assessmentId
    * @param  string  $contextId
    * @param  int     $assignmentId
    * @param  string  $resourceLinkId
    * @return []      $responseAnalytics
    */

    public function getResponseAnalytics($assessmentId, $contextId, $assignmentId = null, $resourceLinkId = null)
    {
        $assessment = Assessment::find($assessmentId);
        $this->attempts = $this->getAttempts($assessmentId, $contextId, $assignmentId, $resourceLinkId);
        $this->assessmentAnalytics = $this->getAssessmentLevelAnalytics();

        if (!$assessment->isCustomAssessment()) {
            $this->questions = $this->getQuestions($assessmentId);
            $this->responseTypes = $this->getResponseTypes();
            $this->answerDictionary = new AnswerDictionary($this->questions);
            $this->setQuestionAndResponseCounts($this->attempts);
            $this->calculateQuestionAnalytics();
        }

        $responseAnalytics = $this->buildResponseAnalytics();
        return $responseAnalytics;
    }

    /**
    * Return all analytics for a student in an LTI context
    *
    * @param  string  $contextId
    * @param  int     $studentId
    * @return []  $studentAnalytics
    */

    public function getStudentAnalytics($contextId, $studentId)
    {
        $this->studentAnalytics = new StudentAnalytics($contextId, $studentId);
        $studentAnalytics = $this->studentAnalytics->getAnalytics();
        return $studentAnalytics;
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Package analytics to include those specific to both assessment and questions
    *
    * @return []  $responseAnalytics
    */

    private function buildResponseAnalytics()
    {
        $questionAnalytics = $this->questions ? $this->questions : null; //if custom activity, no questions

        return [
            'assessmentAnalytics' => $this->assessmentAnalytics,
            'questionAnalytics' => $questionAnalytics
        ];
    }

    /**
    * Calculate average number of attempts made by each student on an assessment
    *
    * @return  float  $avgAttempts
    */

    private function calculateAverageNumberAttempts()
    {
        $attemptList = [];
        $individualAttemptCount = 0;
        $currentUserId = $this->attempts->first()->student->lti_custom_user_id;
        $avgAttempts = 0;

        foreach($this->attempts as $attempt) {
            if ($attempt->student->lti_custom_user_id !== $currentUserId) {
                array_push($attemptList, $individualAttemptCount); //push user's attempt count
                $currentUserId = $attempt->student->lti_custom_user_id; //init for next user
                $individualAttemptCount = 0;
            }
            $individualAttemptCount++;
        }
        array_push($attemptList, $individualAttemptCount); //push the last user's attempt count

        if (count($attemptList)) {
            $avgAttempts = $this->calculateMean($attemptList);
        }

        return $avgAttempts;
    }

    /**
    * Calculate average time that each student spent on their attempt
    *
    * @return  float  $avgTime
    */

    private function calculateAverageTime()
    {
        $timeList = [];
        $avgTime = 0;

        foreach($this->attempts as $attempt) {
            if ($attempt->isStarted()) {
                $time = $attempt->getDuration();
                array_push($timeList, $time);
            }
        }

        if (count($timeList)) {
            $avgTime = $this->calculateMean($timeList);
        }

        return $avgTime;
    }

    /**
    * Calculate the mean for an array
    *
    * @return  float  $mean
    */

    private function calculateMean($arr)
    {
        $total = 0;
        $mean = 0;
        foreach ($arr as $arrItem) {
            $total += +($arrItem);
        }
        $mean = $total / count($arr);

        return round($mean, 2);
    }

    /**
    * Calculate median for an array
    *
    * @return  float  $median
    */

    private function calculateMedian($arr)
    {
        $medianMiddle = 0;
        $median = false;
        sort($arr);
        $medianMiddle = floor((count($arr) - 1) / 2);
        if (count($arr) % 2) {
            $median = $arr[$medianMiddle];
        }
        else {
            $median = ($arr[$medianMiddle] + $arr[$medianMiddle + 1]) / 2;
        }

        return round($median, 2);
    }

    /**
    * Calculate median score on all attempts on an assessment in an LTI context
    *
    * @return  float  $medianScore
    */

    private function calculateMedianScore()
    {
        $scoreList = [];
        $medianScore = 0;

        foreach($this->attempts as $attempt) {
            if ($attempt->isComplete()) {
                $score = $attempt->calculated_score <= 1 ? $attempt->calculated_score * 100 : $attempt->calculated_score;
                array_push($scoreList, $score);
            }
        }
        if (count($scoreList)) {
            $medianScore = $this->calculateMedian($scoreList);
        }

        return $medianScore;
    }

    /**
    * Parent function to init all question-related analytics on the assessment
    *
    * @return  void
    */

    private function calculateQuestionAnalytics()
    {
        $this->calculateResponsePercentages();
    }

    /**
    * Calculate % number of students who have responded with each answer option; the
    * percentages are calculated on each question option type model, which all are
    * applying the QuestionOption interface to setAnalyticsPercentage() on the option
    *
    * @return  void
    */

    private function calculateResponsePercentages()
    {
        //calculate all percentages after we have incremented all of the counts; otherwise, there would
        //be inaccurate numbers since not all question counts would be tabulated until the end
        foreach ($this->questions as $question){
            $this->questions[$question->id]->setAnalyticsPercentage();
            foreach($question->options as $option) {
                $this->questions[$question->id]->options[$option->id]->setAnalyticsPercentage();
            }
        }
    }

    /**
    * Parent function to init all top-level assessment-related analytics
    *
    * @return  []  $assessmentAnalytics
    */

    private function getAssessmentLevelAnalytics()
    {
        $assessmentAnalytics = [];
        $assessmentAnalytics['numAttempts'] = count($this->attempts);
        $assessmentAnalytics['avgAttempts'] = $this->calculateAverageNumberAttempts();
        $assessmentAnalytics['medianScore'] = $this->calculateMedianScore();
        $assessmentAnalytics['avgTime'] = $this->calculateAverageTime();

        return $assessmentAnalytics;
    }

    /**
    * Get all attempts on this assessment and in this LTI context from the database
    *
    * @param  int     $assessmentId
    * @param  string  $contextId
    * @param  int     $assignmentId
    * @param  string  $resourceLinkId
    * @return [] $attempts
    */

    private function getAttempts($assessmentId, $contextId, $assignmentId = null, $resourceLinkId = null)
    {
        $emptyAttemptsHidden = false;
        return Attempt::getAttemptsForAssessment($assessmentId, $contextId, $assignmentId, $resourceLinkId, $emptyAttemptsHidden);
    }

    /**
    * Get the questions associated with this assessment
    *
    * @param  int  $assessmentId
    * @return [] $questions
    */

    private function getQuestions($assessmentId)
    {
        $noAnswers = false;
        $questions = Question::getAssessmentQuestions($assessmentId, $noAnswers);
        $questions = $questions->keyBy('id'); //for efficiency, O(1) vs. O(N) retrieval time
        foreach($questions as &$question) {
            $question->setQuestionAnalytics();
            $question->options = $question->options->keyBy('id'); //for efficiency, O(1) vs. O(N) retrieval time
            foreach($question->options as &$option) {
                $option->setResponseAnalytics($question->questionAnalytics);
            }
        }
        return $questions;
    }

    /**
    * Get response types associated with a quiz, for more efficient eager loading
    *
    * @return [] $responseTypes
    */

    private function getResponseTypes() {
        $responseTypes = [];

        foreach($this->questions as $question) {
            $questionType = $question->question_type;
            $responseType = StudentResponse::getResponseRelationshipFromQuestionType($questionType);

            $responseTypeSaved = false;
            foreach($responseTypes as $foundResponseType) {
                if ($foundResponseType === $responseType) {
                    $responseTypeSaved = true;
                }
            }

            if (!$responseTypeSaved) {
                array_push($responseTypes, $responseType);
            }
        }

        return $responseTypes;
    }

    /**
    * Set counts on the assessment questions and responses so they can later be calculated into percentages
    *
    * @param  []  $attempts
    * @return void
    */

    private function setQuestionAndResponseCounts($attempts)
    {
        foreach($attempts as $attempt) {
            //fetch responses one attempt at a time; although slower than all at once, we don't want to run
            //into timeout errors in PHP for fetching too much data or slow things down with chunking
            $responses = StudentResponse::getAttemptResponses($attempt->id, $this->responseTypes)->toArray();
            $this->updateResponseAnalytics($responses);
        }
    }

    /**
    * Update analytics for responses as each batch of responses comes in
    *
    * @param  []  $studentResponses
    * @return void
    */

    private function updateResponseAnalytics($studentResponses) {
        foreach ($studentResponses as $studentResponse) {
            $responseModel = StudentResponse::getModelFromStudentResponse($studentResponse);
            if (!$responseModel) {
                //if nothing found -- might happen in the rare case that a previously used
                //answer is deleted and the cascading delete removes the responses.
                continue;
            }

            $responseModel->setAnswerDictionary($this->answerDictionary);
            $questionId = $responseModel->getQuestionIdFromResponse($studentResponse);
            $this->questions[$questionId]->incrementAnalytics($studentResponse);
            //some questions are paired (i.e., matrix row and column) and others are singular (i.e., multiple choice),
            //we are expecting on getting back an array of arrays with a primary option ID in each group compatible with both
            $optionIdGroups = $responseModel->getOptionIdsFromResponse($studentResponse, $this->questions[$questionId]);
            foreach($optionIdGroups as $optionIds) {
                $primaryOptionId = $optionIds['primary'];
                $this->questions[$questionId]->options[$primaryOptionId]->incrementAnalytics($optionIds);
            }
        }
    }
}
