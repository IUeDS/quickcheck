<?php
namespace App\Models;
use DateTime;
use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Http\Request;
use App\Classes\ExternalData\CanvasAPI;
use App\Classes\LTI\Outcome;
use App\Classes\LTI\Grade;
use App\Models\CourseContext;
use App\Models\Student;
use App\Classes\LTI\LtiContext;
use App\Exceptions\SessionMissingLtiContextException;

class Attempt extends Eloquent {
    protected $table = 'attempts';
    protected $fillable = ['assessment_id',
                            'course_context_id',
                            'student_id',
                            'lti_custom_assignment_id',
                            'lti_custom_section_id',
                            'lis_outcome_service_url',
                            'lis_result_sourcedid',
                            'last_milestone',
                            'count_correct',
                            'count_incorrect',
                            'calculated_score',
                            'complete',
                            'assignment_title',
                            'due_at'
                            ];

    //class variables
    public $optionalParams = ['last_milestone', 'count_correct', 'count_incorrect', 'complete', 'calculated_score'];

    public function assessment() {
        return $this->belongsTo('App\Models\Assessment');
    }

    public function courseContext() {
        return $this->belongsTo('App\Models\CourseContext');
    }

    public function student() {
        return $this->belongsTo('App\Models\Student');
    }

    public function studentResponses() {
        return $this->hasMany('App\Models\StudentResponse');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Given a chunk of attempts with related data, export an array amenable to CSV export
    *
    * @param  Collection     $attempts
    * @param  CourseContext  $courseContext
    * @return []
    */

    public static function formatExport($attempts, $courseContext) {
        $attempts = $attempts->toArray();
        $courseContext = $courseContext->toArray();
        $courseData = CourseContext::formatExport($courseContext);
        $formattedAttempts = [];

        foreach ($attempts as $attempt) {
            //get count correct/count incorrect based on responses;
            $responses = $attempt['student_responses'];
            //custom activities may set the count correct/incorrect manually, so don't overwrite it; only write if not included
            if (!$attempt['count_correct'] && !$attempt['count_incorrect']) {
                $countCorrect = 0;
                $countIncorrect = 0;
                foreach ($responses as $response) {
                    if ($response['is_correct'] == 1) {
                        $countCorrect++;
                    }
                    else {
                        $countIncorrect++;
                    }
                }
                $attempt['count_correct'] = $countCorrect;
                $attempt['count_incorrect'] = $countIncorrect;
                if (count($attempt['assessment']['questions'])) {
                    $attempt['calculated_score'] = $countCorrect / count($attempt['assessment']['questions']) * 100;
                }
            }
            //assessment, student, and course context information
            $attempt['assessment_name'] = $attempt['assessment']['name'];
            $studentData = Student::formatExport($attempt['student']);
            $attempt = array_merge($attempt, $studentData, $courseData);

            //remove columns that the instructor doesn't need and nested objects
            $removeKeys = [
                'assessment',
                'course_context_id',
                'lis_outcome_service_url',
                'lis_result_sourcedid',
                'student',
                'student_responses',
                'student_id'
            ];
            foreach ($removeKeys as $key) {
                unset($attempt[$key]);
            }
            array_push($formattedAttempts, $attempt);
        }
        return $formattedAttempts;
    }

    /**
    * Get an attempt's assessment ID
    *
    * @return int
    */

    public function getAssessmentId() {
        return $this->assessment_id;
    }

    /**
    * Get an attempt's assignment ID from Canvas
    *
    * @return int
    */

    public function getAssignmentId() {
        return $this->lti_custom_assignment_id;
    }

    /**
    * Find the assignment ID for an assessment within a course context.
    *
    * @param  CourseContext  $courseContext
    * @param  int  $assessmentId
    * @return int
    */

    public static function getAssignmentIdFromAttempts($courseContext, $assessmentId)
    {
        $firstAttempt = Attempt::where('course_context_id', '=', $courseContext->id)
            ->where('assessment_id', '=', $assessmentId)
            ->firstOrFail();

        return $firstAttempt->getAssignmentId();
    }

    /**
    * Get an attempt's calculated score
    *
    * @return int
    */

    public function getCalculatedScore() {
        //don't think we'll run into this, but if the attempt has not been updated at all and
        //this value is still NULL, then return 0
        if (is_null($this->calculated_score)) {
            return 0;
        }

        return $this->calculated_score;
    }

    /**
    * Get the time zone of the course where an attempt was made
    *
    * @return string
    */

    public function getCourseTimeZone() {
        $courseContext = $this->courseContext()->first();
        return $courseContext->getTimeZone();
    }

    /**
    * Get an attempt's due_at timestamp
    *
    * @return timestamp
    */

    public function getDueAt($convertToDateTime = false) {
        if ($convertToDateTime && $this->due_at) { //don't convert a null value
            //convert due_at from datetime to timestamp
            return new DateTime($this->due_at);
        }

        return $this->due_at;
    }

    /**
    * Get an attempt's score, based on number of correct responses out of total question count
    *
    * @return int
    */

    public function getScore() {
        $calculatedScore = 0;
        $countCorrect = $this->getCountCorrect();
        $partialCredit = $this->getPartialCredit();
        $points = $countCorrect + $partialCredit;
        $questionCount = $this->assessment->questions->count();
        if ($questionCount > 0) {
            $calculatedScore = $points / $questionCount;
        }
        return $calculatedScore;
    }

    /**
    * Get an attempt's sourcedId
    *
    * @return string
    */

    public function getSourcedId() {
        return $this->lis_result_sourcedid;
    }

    /**
    * Get all attempts made on an assessment in a course context
    *
    * @param  int  $assessment_id
    * @param  int  $context_id
    * @param  bool $emptyAttemptsHidden
    * @return []   $attempts
    */

    public static function getAttemptsForAssessment($assessment_id, $context_id, $emptyAttemptsHidden) {
        //get all attempts; sort by last name, but sort by user ID secondarily in case two users
        //have the same last name; for each user, sort attempts chronologically. this query is
        //a bit more involved, since we need to sort by student name, which is on a separate model.
        //note that ->select('attempts.*') was necessary to prevent attempt ID from being overwritten
        //on the join with the students table.
        $courseContext = CourseContext::where('lti_context_id', '=', $context_id)->first();
        $attempts = Attempt::where('course_context_id', '=', $courseContext->id)
            ->where('assessment_id', '=', $assessment_id)
            ->select('attempts.*')
            ->join('students', 'attempts.student_id', '=', 'students.id')
            ->orderBy('lis_person_name_family', 'ASC')
            ->orderBy('lti_custom_user_id', 'ASC')
            ->orderBy('attempts.created_at', 'ASC');

        if ($emptyAttemptsHidden) {
            $attempts = $attempts->has('studentResponses');
        }

        $attempts = $attempts->get();

        return $attempts;
    }

    /**
    * Get all attempts made by a student in a course context, grouped by assessment.
    *
    * @param  int  $student_id
    * @param  int  $context_id
    * @return []   $attempts
    */

    public static function getAssessmentsWithAttemptsForStudent($student_id, $context_id) {
        $assessmentAttempts = [];
        $courseContext = CourseContext::where('lti_context_id', '=', $context_id)->firstOrFail();
        $student = Student::find($student_id);

        //1) get attempts grouped by assessment
        $attemptsByAssessment = Attempt::where('course_context_id', '=', $courseContext->id)
            ->where('student_id', '=', $student_id)
            ->groupBy('assessment_id')
            ->orderBy('created_at')
            ->get();

        foreach($attemptsByAssessment as $assessmentAttempt) {
            //2) get each assessment
            $assessment_id = $assessmentAttempt->assessment_id;
            $assessment = Assessment::find($assessment_id);
            if (!$assessment) { //exclude soft-deletes
                continue;
            }

            //3) get attempts for each assessment
            $attempts = Attempt::where('course_context_id', '=', $courseContext->id)
                ->where('assessment_id', '=', $assessment_id)
                ->where('student_id', '=', $student_id)
                ->select('attempts.*')
                ->join('students', 'attempts.student_id', '=', 'students.id')
                ->orderBy('attempts.created_at', 'ASC')
                ->get();

            //4) add additional info for context onto each attempt
            foreach($attempts as $attempt) {
                $responses = StudentResponse::getResponsesForAttempt($attempt->id);
                $attempt->student_responses = $responses;
                $attempt->student = $student;
            }

            $assessment->attempts = $attempts;
            array_push($assessmentAttempts, $assessment);
        }

        return $assessmentAttempts;
    }

    /**
    * Get the duration of an attempt
    *
    * @return float (time in seconds)
    */

    public function getDuration() {
        return $this->updated_at->getTimestamp() - $this->created_at->getTimestamp();
    }

    /**
    * Initialize an attempt for a given assessment_id;
    * Writes a record in the database for the attempt, and can create either LTI or anonymous attempts;
    *
    * @param  Request $request
    * @param  str     $assessment_id
    * @return []      (includes attempt ID, attempt type, and optional group name)
    */

    public function initAttempt($assessmentId, Request $request) {
        $attemptType = $this->getAttemptType($request);
        $attempt = null;
        $groupName = null;

        if ($attemptType === 'LTI') {
            $attempt = $this->initLtiAttempt($assessmentId, $request);
        }
        else {
            $attempt = $this->initAnonymousAttempt($assessmentId);
        }

        //get group information, if necessary; only provided if custom activity has group in request
        if ($request->has('group')) {
            $groupName = $this->getGroupName($attemptType, $attempt);
        }

        return ['attemptId' => $attempt->id, 'attemptType' => $attemptType, 'groupName' => $groupName];
    }

    /**
    * Determine if the attempt is complete
    *
    * @return boolean
    */

    public function isComplete() {
        if ($this->complete == 1) {
            return true;
        }

        return false;
    }

    /**
    * Determine if the attempt is past due
    *
    * @return boolean
    */

    public function isPastDue() {
        if (!$this->getDueAt()) { //no due date
            return false;
        }

        $convertToDateTime = true;
        $dueAt = $this->getDueAt($convertToDateTime)->getTimeStamp();
        $updatedAt = $this->updated_at->getTimeStamp();
        if ($updatedAt >= $dueAt) {
            return true;
        }

        return false;
    }

    /**
    * Determine if the attempt had been started
    *
    * @return boolean
    */

    public function isStarted() {
        //if the student had started the activity by answering questions
        $stage = $this->last_milestone;
        if ($stage !== 'LTI Launch' && $stage !== 'Anonymous Launch') {
            return true;
        }

        return false;
    }

    /**
    * Determine if the attempt is tied to the gradebook and can be graded
    *
    * @return boolean
    */

    public function isTiedToGradebook() {
        if ($this->lis_result_sourcedid) {
            return true;
        }

        return false;
    }

    /**
    * Update attempt
    *
    * @param  []  $attemptData
    * @return []  (include displayedScore)
    */

    public function updateAttempt($attemptData) {
        $this->saveOptionalParams($attemptData);
        //sometimes score is passed explicitly in custom activities; otherwise, calculate based on assessment
        if (!array_key_exists('calculated_score', $attemptData)) {
            $this->calculated_score = $this->getScore();
        }
        $this->save();
        return ['displayedScore' => $this->calculated_score];
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Get the attempt type (anonymous or LTI)
    *
    * @param  Request $request
    * @return string
    */

    private function getAttemptType($request) {
        if ($request->has('preview')) {
            //boolean in js comes through as string
            $isPreview = $request->input('preview') === "true" ? true : false;
            //if preview included, it's an anonymous attempt; although LTI data may be present
            //for an instructor previewing, it gets messy because assessment-specific information
            //may not be present if the instructor has not accessed it via an assignment
            if ($isPreview) {
                return 'Anonymous';
            }
        }
        if (LtiContext::isInLtiContext() && !$request->has('anonymous')) {
            return 'LTI';
        }

        //if not explicitly an instructor preview and no LTI context, throw an error;
        //students who have an expired session should be told to refresh the LTI launch
        throw new SessionMissingLtiContextException;
    }

    /**
    * Get total count correct; this column is set directly with custom activities, otherwise,
    * the column is NULL and the value is based on number of related correct responses
    *
    * @return int
    */

    private function getCountCorrect() {
        if (!is_null($this->count_correct)) {
            return $this->count_correct;
        }
        return $this->studentResponses()->where('is_correct', '=', 1)->count();
    }

    /**
    * If a custom activity where group name is included, get the name of the student's group
    *
    * @param  string  $attemptType
    * @param  Attempt $attempt
    * @return string
    */

    private function getGroupName($attemptType, $attempt) {
        //instructors and course designers can't be in a group, but students can be; technically the Canvas API class will
        //just send back false for the group name if an instructor/designer, but it does still need to run quite a few
        //API queries, so it will save some time to bypass that step altogether if an instructor/designer in LTI context
        if ($attemptType === 'LTI' && LtiContext::isInstructor()) {
            return false;
        }
        $courseContext = CourseContext::find($attempt->course_context_id);
        $courseId = $courseContext->lti_custom_course_id;
        $student = Student::find($attempt->student_id);
        $studentId = $student->lti_custom_user_id;
        $canvasAPI = new CanvasAPI;
        $groupName = $canvasAPI->getUserGroup($courseId, $studentId);
        return $groupName;
    }

    /**
    * Get total partial credit on an attempt, across all questions
    *
    * @return int
    */

    private function getPartialCredit() {
        return $this->studentResponses->sum('partial_credit');
    }

    /**
    * Initialize an anonymous attempt
    *
    * @param  int  $assessmentId
    * @return Attempt
    */

    private function initAnonymousAttempt($assessmentId) {
        $attempt = new Attempt;
        $attempt->assessment_id = $assessmentId;
        $attempt->last_milestone = "Anonymous Launch";
        $attempt->save();
        return $attempt;
    }

    /**
    * Initialize an LTI attempt
    *
    * @param  int     $assessmentId
    * @param  Request $request
    * @return Attempt
    */

    private function initLtiAttempt($assessmentId, $request) {
        $attempt = new Attempt;
        $ltiContext = new LtiContext();
        $attemptData = $ltiContext->getAttemptDataFromSession($request, $assessmentId);
        $attempt = $attempt->create($attemptData);
        return $attempt;
    }

    /**
    * Save optional parameters when updating an attempt, if present
    * (i.e., new milestone is not always reached each time a question is submitted, etc.)
    *
    * @param  []  $attemptData
    * @return void
    */

    private function saveOptionalParams($attemptData) {
        foreach($this->optionalParams as $optionalParam) {
            if (array_key_exists($optionalParam, $attemptData)) {
                $this->setAttribute($optionalParam, $attemptData[$optionalParam]);
            }
        }
    }
}