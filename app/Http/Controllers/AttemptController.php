<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Classes\LTI\BLTI;
use App\Classes\ExternalData\CanvasAPI;
use App\Classes\ExternalData\CSV;
use App\Models\Assessment;
use App\Models\Attempt;
use App\Models\CourseContext;
use App\Models\StudentResponse;
use App\Models\Question;
use App\Models\Release;
use App\Models\Student;
use App\Models\CollectionFeature;

class AttemptController extends \BaseController
{

    public $courseId = null;

    /************************************************************************/
    /* VIEW ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * In LTI context, see all attempts that have been made for an assessment in a context
    *
    * @param  string  context (query string param)
    * @param  int  $assessmentId
    * @return success or error in a JSON Response
    */

    public function manageAttempts($assessmentId)
    {
        return view('manage/attempts');
    }

    /**
    * In LTI context, see all assessments that have attempts made in a context
    *
    * @param   string  context (query string param)
    * @return View
    */

    public function manageOverview()
    {
        return view('manage/overview');
    }

    /**
    * In LTI context, see all attempts that have been made by a student
    *
    * @param  int studentId
    * @return View
    */

    public function viewAttemptsForStudent()
    {
        return view('manage/attemptsforstudent');
    }

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Get all attempts for an assessment
    *
    * @param  int  $assessment_id,
    * @param  string  $context_id
    * @return success (with attempts, assessment info, and user list) or error in a JSON Response
    */

    public function getAttemptsForAssessment($assessment_id, $context_id, Request $request)
    {
        $attempts = [];
        $assessment = null;
        $assignment = null;

        if (!$assessment_id || !$context_id) {
            return response()->error(400, ['An LTI context ID and/or assessment ID was not supplied in this request.']);
        }

        //list of attempts will not include those with no responses if feature is enabled to hide empty attempts
        $collectionFeature = new CollectionFeature;
        $emptyAttemptsHidden = $collectionFeature->areEmptyAttemptsHidden($assessment_id);

        //fetch all attempts and tack on student responses, so we can determine count correct/incorrect. etc.
        //note that we are using a foreach() rather than a with() in the query because of the performance cost
        //with large numbers of attempts; foreach() is over twice as fast
        $attempts = Attempt::getAttemptsForAssessment($assessment_id, $context_id, $emptyAttemptsHidden);
        foreach($attempts as $attempt) {
            $responses = StudentResponse::getResponsesForAttempt($attempt['id']);
            $student = Student::find($attempt['student_id']);
            $attempt['student_responses'] = $responses;
            $attempt['student'] = $student;
        }
        $assessment = Assessment::find($assessment_id);
        $courseContext = CourseContext::where('lti_context_id', '=', $context_id)->first();
        $assignment = $this->getCanvasAssignmentFromAttempts($attempts, $courseContext->lti_custom_course_id);
        $canvasCourse = $this->getCanvasCourse($courseContext->lti_custom_course_id);
        $release = $this->getReleaseForAssessment($assessment_id, $courseContext->id);

        return response()->success([
            'attempts' => $attempts,
            'canvasCourse' => $canvasCourse,
            'courseContext' => $courseContext,
            'assessment' => $assessment,
            'release' => $release,
            'assignment' => $assignment
        ]);
    }

    /**
    * Get attempts grouped by assessments, so assessments with attempts returned
    *
    * @param  string  $context_id
    * @return Response (on success: includes unique assessments that have attempts)
    */

    public function getAttemptsForContext($context_id, Request $request)
    {
        if (!$context_id) {
            return response()->error(400, ['An LTI context ID was not supplied in this request.']);
        }

        $courseContext = CourseContext::where('lti_context_id', '=', $context_id)->first();
        $attempts = Attempt::with('assessment')
                ->where('course_context_id', '=', $courseContext->id)
                ->groupBy('assessment_id')
                ->get();

        //not possible to sort by eager loaded relationship in Laravel without a join;
        //considering number of quick checks in a course is small, running sort on the
        //Laravel collection instead of through DB shouldn't be an issue efficiency-wise
        $sortedAttempts = $attempts->sortBy(function ($attempt, $key) {
            return $attempt['assessment']['name'];
        })->values();

        return response()->success(['attempts' => $sortedAttempts]);
    }

    /**
    * Get all attempts for a student in a course
    *
    * @param  string  $contextId
    * @param  int     $studentId
    * @return Response (on success: includes attempts, course context, and user course membership)
    */

    public function getAttemptsForStudentInCourse($contextId, $studentId, Request $request)
    {
        if (!$contextId) {
            return response()->error(400, ['An LTI context ID was not supplied in this request.']);
        }

        //fetch all attempts, grouped by assessment
        $assessmentsWithAttempts = Attempt::getAssessmentsWithAttemptsForStudent($studentId, $contextId);

        //fetch user from Canvas API
        $courseContext = CourseContext::where('lti_context_id', '=', $contextId)->firstOrFail();
        $courseId = $courseContext->getCourseId();
        $canvasUserId = Student::find($studentId)->getCanvasUserId();
        $canvasAPI = new CanvasAPI;
        $user = $canvasAPI->getUserFromAPI($courseId, $canvasUserId);

        return response()->success([
            'assessmentsWithAttempts' => $assessmentsWithAttempts,
            'courseContext' => $courseContext,
            'user' => $user
        ]);
    }

    /**
    * Get all attempts for a single student (in the student's view)
    *
    * @param  int  $assessment_id,
    * @param  string  $context_id
    * @return Response (success includes: attempts, responses, questions, dueAt)
    */

    public function getStudentAssessmentAttempts($assessmentId, $contextId, Request $request)
    {
        //determine whether students should see their responses based on feature toggle
        $eagerLoading = ['studentResponses'];
        $collectionFeature = new CollectionFeature;
        $showResponses = $collectionFeature->isViewableResponsesEnabled($assessmentId);
        if ($showResponses) {
            //eager load all of the related response types for the different questions.
            //it's a handful! since we are loading attempts for just a single student
            //on a single quiz, the performance cost here is not as huge as it otherwise
            //would be with a large number of attempts.
            $responseTypes = [
                'studentResponses.mcResponses',
                'studentResponses.dropdownResponses',
                'studentResponses.matchingResponses',
                'studentResponses.matrixResponses',
                'studentResponses.numericalResponses',
                'studentResponses.textmatchResponses',
                'studentResponses.customResponses'
            ];
            $eagerLoading = array_merge($eagerLoading, $responseTypes);
        }

        $studentUsername = Session::get('student');
        $student = Student::where('lti_custom_canvas_user_login_id', '=', $studentUsername)->first();
        $courseContext = CourseContext::where('lti_context_id', '=', $contextId)->first();
        $attempts = Attempt::with($eagerLoading)
            ->where('assessment_id', '=', $assessmentId)
            ->where('course_context_id', '=', $courseContext->id)
            ->where('student_id', '=', $student->id)
            ->get()
            ->toArray();

        //get the assessment information and related questions/options
        $assessment = Assessment::find($assessmentId);
        $questionModel = new Question;
        $noAnswers = false;
        $questions = $questionModel->getAssessmentQuestions($assessmentId, $noAnswers);

        return response()->success([
            'attempts' => $attempts,
            'courseContext' => $courseContext,
            'showResponses' => $showResponses,
            'questions' => $questions
        ]);
    }

    /**
    * Create an attempt record
    *
    * @param  int  $assessment_id
    * @return attempt ID and attempt type in a JSON Response
    */

    public function initAttempt($assessment_id, Request $request)
    {
        $attempt = new Attempt;
        $attemptData = $attempt->initAttempt($assessment_id, $request);
        return response()->success($attemptData);
    }

    /**
    * Update an attempt record
    *
    * @param  int  $attempt_id
    * @return success or error in a JSON Response
    */

    public function updateAttempt($attempt_id, Request $request)
    {
        $attempt = Attempt::findOrFail($attempt_id);
        $result = $attempt->updateAttempt($request->all());
        return response()->success($result);
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * When interacting with Canvas API, need to get the canvas assignment from the
    * attempts made in an LTI context. Find assignment ID from attempts in database first.
    *
    * @param   array  $attempts
    * @return  object  $assignment (from Canvas API)
    */

    private function getCanvasAssignmentFromAttempts($attempts, $courseId) {
        $canvasAPI = new CanvasAPI;
        $assignment = null;
        $assignmentId = null;
        //if the assessment was embedded as a module item rather than an assignment, then there
        //may not be an assignment ID; look through all of the attempts to see if an assignment
        //ID exists to determine if we need to query the Canvas API or not; in most cases, we
        //could probably just check the first one, but let's be sure in case something's off
        foreach ($attempts as $attempt) {
            if ($attempt->lti_custom_assignment_id) {
                $assignmentId = $attempt->lti_custom_assignment_id;
                break;
            }
        }

        if ($assignmentId) {
            $assignment = $canvasAPI->getAssignment($courseId, $assignmentId);
        }

        return $assignment;
    }

    /**
    * Get Canvas course from API
    *
    * @param   int  $courseId
    * @return  []   $course
    */

    private function getCanvasCourse($courseId) {
        $canvasAPI = new CanvasAPI();
        $includeStudentCount = true;
        $course = $canvasAPI->getCourse($courseId, $includeStudentCount);
        return $course;
    }

    /**
    * Determine if there is a current release for this assessment or not
    *
    * @param   int   $assessment_id
    * @param   int   $course_context_id
    * @return  mixed boolean FALSE if no release, or [] $release if existing
    */

    private function getReleaseForAssessment($assessment_id, $course_context_id) {
        $release = false;
        $releaseModel = new Release();
        $existingRelease = $releaseModel->exists($assessment_id, $course_context_id);
        if ($existingRelease) {
            $release = $existingRelease->toArray();
        }

        return $release;
    }
}
