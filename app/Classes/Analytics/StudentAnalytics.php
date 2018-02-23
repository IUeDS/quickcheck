<?php

namespace App\Classes\Analytics;

use App\Models\Attempt;

class StudentAnalytics {
    private $assessmentsWithAttempts = [];
    private $contextId;
    private $studentId;

    public function __construct($contextId, $studentId)
    {
        $this->contextId = $contextId;
        $this->studentId = $studentId;
    }

    /**
    * Get analytics on student performance across all attempts in a course context
    *
    * @return []
    */

    public function getAnalytics()
    {
        $analytics = [];
        $this->assessmentsWithAttempts = Attempt::getAssessmentsWithAttemptsForStudent($this->studentId, $this->contextId);

        $analytics['totalAttempts'] = $this->getTotalAttempts();
        $analytics['averageScore'] = $this->getAverageScore();
        $analytics['totalQuestions'] = $this->getTotalQuestionsAnswered();
        $analytics['averageRetries'] = $this->getAverageRetries();
        $analytics['totalTime'] = $this->getTotalTime();
        $analytics['totalTimeBeforeDueDate'] = $this->getTotalTimeBeforeDueDate();
        $analytics['totalTimeAfterDueDate'] = $this->getTotalTimeAfterDueDate();
        $analytics['averageTime'] = $this->getAverageTime();
        $analytics['averageTimeBeforeDueDate'] = $this->getAverageTimeBeforeDueDate();
        $analytics['averageTimeAfterDueDate'] = $this->getAverageTimeAfterDueDate();
        $analytics['averageTimeUntilDueDate'] = $this->getAverageTimeUntilDueDate();


        return $analytics;
    }

    /**
    * Get the average number of retries on each quick check
    *
    * @return float
    */

    public function getAverageRetries()
    {
        $allRetries = [];

        foreach($this->assessmentsWithAttempts as $assessment) {
            $retries = -1; //the first attempt does not count as a retry

            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted()) {
                    $retries++;
                }
            }

            if ($retries >= 0) {
                array_push($allRetries, $retries);
            }
        }

        if (count($allRetries) === 0) {
            return 0;
        }

        //give retries in whole numbers
        return round($this->calculateMean($allRetries), 0);
    }

    /**
    * Get the average calculated score across all attempts
    *
    * @return float
    */

    public function getAverageScore()
    {
        $allScores = [];

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted()) {
                    //number should be out of 100
                    array_push($allScores, $attempt->getCalculatedScore() * 100);
                }
            }
        }

        if (count($allScores) === 0) {
            return 0;
        }

        return $this->calculateMean($allScores);
    }

    /**
    * Get the average time per attempt across all attempts
    *
    * @return float
    */

    public function getAverageTime()
    {
        $timeList = [];

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted()) {
                    $time = $attempt->getDuration();
                    array_push($timeList, $time);
                }
            }
        }

        if (count($timeList) === 0) {
            return 0;
        }

        return $this->calculateMean($timeList);
    }

    /**
    * Get average time spent after the due date on each assessment
    *
    * @return float (time in seconds)
    */

    public function getAverageTimeAfterDueDate()
    {
        $timeList = [];

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted() && $attempt->isPastDue()) {
                    $time = $attempt->getDuration();
                    array_push($timeList, $time);
                }
            }
        }

        if (count($timeList) === 0) {
            return 0;
        }

        return $this->calculateMean($timeList);
    }

    /**
    * Get average time spent before the due date on each assessment
    *
    * @return float (time in seconds)
    */

    public function getAverageTimeBeforeDueDate()
    {
        $timeList = [];

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted() && !$attempt->isPastDue()) {
                    $time = $attempt->getDuration();
                    array_push($timeList, $time);
                }
            }
        }

        if (count($timeList) === 0) {
            return 0;
        }

        return $this->calculateMean($timeList);
    }

    /**
    * Get average time difference between when the student completed their first attempt
    * and when the due date was
    *
    * @return float (time in seconds)
    */

    public function getAverageTimeUntilDueDate()
    {
        $timeList = [];

        foreach($this->assessmentsWithAttempts as $assessment) {
            //attempts are ordered by created_at time, so grab the first for each assessment
            if (count($assessment->attempts) === 0) {
                continue;
            }

            $firstAttempt = $assessment->attempts[0];
            $convertToDateTime = true;
            $dueAt = $firstAttempt->getDueAt($convertToDateTime);

            if (!$dueAt) {
                continue;
            }

            $startedAt = $firstAttempt->created_at->getTimeStamp();
            $dueAt = $dueAt->getTimeStamp();

            //for ungraded module items, Canvas marks 0000-00-00 00:00:00 as the due date;
            //this creates a massive negative number for this average value, so disregard
            if ($dueAt <= 0) {
                continue;
            }

            $timeBeforeDueAt = $dueAt - $startedAt; //can potentially be negative if started after
            array_push($timeList, $timeBeforeDueAt);
        }

        if (count($timeList) === 0) {
            return 0;
        }

        return $this->calculateMean($timeList);
    }

    /**
    * Get total number of attempts made in the course
    *
    * @return int
    */

    public function getTotalAttempts()
    {
        $attemptCount = 0;

        foreach($this->assessmentsWithAttempts as $assessment) {
            $attemptCount += count($assessment->attempts);
        }

        return $attemptCount;
    }

    /**
    * Get total number of questions answered
    *
    * @return int
    */

    public function getTotalQuestionsAnswered()
    {
        $totalQuestions = 0;

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted()) {
                    $totalQuestions += count($attempt->student_responses);
                }
            }
        }

        return $totalQuestions;
    }

    /**
    * Get total time spent on attempts in the course
    *
    * @return float (time in seconds)
    */

    public function getTotalTime()
    {
        $totalTime = 0;

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted()) {
                    $totalTime += $attempt->getDuration();
                }
            }
        }

        return $totalTime;
    }

    /**
    * Get total time spent on assessments after the due date
    *
    * @return float (time in seconds)
    */

    public function getTotalTimeAfterDueDate()
    {
        $totalTime = 0;

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted() && $attempt->isPastDue()) {
                    $totalTime += $attempt->getDuration();
                }
            }
        }

        return $totalTime;
    }

    /**
    * Get total time spent on assessments before the due date
    *
    * @return float (time in seconds)
    */

    public function getTotalTimeBeforeDueDate()
    {
        $totalTime = 0;

        foreach($this->assessmentsWithAttempts as $assessment) {
            foreach($assessment->attempts as $attempt) {
                if ($attempt->isStarted() && !$attempt->isPastDue()) {
                    $totalTime += $attempt->getDuration();
                }
            }
        }

        return $totalTime;
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
}