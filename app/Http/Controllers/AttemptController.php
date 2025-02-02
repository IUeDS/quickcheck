<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Classes\LTI\LtiContext;
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
    * @param  int  $assignmentId
    * @return success or error in a JSON Response
    */

    public function manageAttempts($assessmentId, $assignmentId = null)
    {
        return displaySPA();
    }

    /**
    * In LTI context, see all assessments that have attempts made in a context
    *
    * @param   string  context (query string param)
    * @return View
    */

    public function manageOverview()
    {
        return displaySPA();
    }

    /**
    * In LTI context, see all attempts that have been made by a student
    *
    * @param  int studentId
    * @return View
    */

    public function viewAttemptsForStudent()
    {
        return displaySPA();
    }

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Get all attempts for an assessment
    *
    * @param  int     $assessment_id,
    * @param  string  $context_id
    * @param  int     $assignment_id
    * @param  string  @resource_link_id
    * @return success (with attempts, assessment info, and user list) or error in a JSON Response
    */

    public function getAttemptsForAssessment($assessment_id, $context_id, $assignment_id = null, $resource_link_id = null)
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
        $attempts = Attempt::getAttemptsForAssessment($assessment_id, $context_id, $assignment_id, $resource_link_id, $emptyAttemptsHidden);
        foreach($attempts as $attempt) {
            $responses = StudentResponse::getResponsesForAttempt($attempt['id']);
            $student = Student::find($attempt['student_id']);
            $attempt['student_responses'] = $responses;
            $attempt['student'] = $student;
        }
        $assessment = Assessment::find($assessment_id);
        $courseContext = CourseContext::where('lti_context_id', '=', $context_id)->first();
        $sourcedId = $courseContext->getCourseOfferingSourcedid();
        $canvasCourse = $this->getCanvasCourse($courseContext->lti_custom_course_id);
        $release = $this->getReleaseForAssessment($assessment_id, $courseContext->id);

        //get related assignment (or return NULL if a module item), but return error response if assignment deleted
        $canvasAPI = new CanvasAPI;
        $assignment = null;
        if ($assignment_id) {
            try {
                $assignment = $canvasAPI->getAssignment($courseContext->lti_custom_course_id, $assignment_id);
            }
            catch (\Exception $e) {
                return response()->error(400, ['This quick check was embedded in an assignment that has since been deleted. Results are unavailable.']);
            }
        }

        return response()->success([
            'attempts' => $attempts,
            'canvasCourse' => $canvasCourse,
            'courseContext' => $courseContext,
            'assessment' => $assessment,
            'release' => $release,
            'assignment' => $assignment,
            'sourcedId' => $sourcedId
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
        $sourcedId = $courseContext->getCourseOfferingSourcedid(); //course abbreviation to include with page titles
        $attempts = Attempt::with(['assessment', 'lineItem'])
                ->where('course_context_id', '=', $courseContext->id)
                ->groupBy('resource_link_id') //if embedded in multiple assignments, separate out
                ->get();

        //grouping by the resource link ID for multiple embeds means that the first queried item may be
        //an attempt by an instructor without a line item attached to it, and we need that data for the 
        //assignment ID; we can't only select relations that have a value for line item ID because the 
        //instructor may be testing before students use the QC or it may be ungraded or a module item;
        //so run a separate query on each assignment to find an attempt where line item is not null, if applicable
        foreach ($attempts as $attempt) {
            if ($attempt->lineItem) {
                continue;
            }

            $lineItem = Attempt::getLineItemFromAttempts($courseContext->id, $attempt->assessment_id, $attempt->resource_link_id);
            if ($lineItem) {
                $attempt->lineItem()->associate($lineItem); //associate just for purposes of listing gradeable assignments on front-end, not saving it!
            }
        }
        

        //not possible to sort by eager loaded relationship in Laravel without a join;
        //considering number of quick checks in a course is small, running sort on the
        //Laravel collection instead of through DB shouldn't be an issue efficiency-wise
        $sortedAttempts = $attempts->sortBy(function ($attempt, $key) {
            if ($attempt['assessment']) { //if assessment was soft-deleted, NULL is returned
                return $attempt['assessment']['name'];
            }
        })->toArray();

        return response()->success(['attempts' => array_values($sortedAttempts), 'sourcedId' => $sourcedId]);
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
        $sourcedId = $courseContext->getCourseOfferingSourcedid();
        $courseId = $courseContext->getCourseId();
        $canvasUserId = Student::find($studentId)->getCanvasUserId();
        $canvasAPI = new CanvasAPI;
        $user = $canvasAPI->getUserFromAPI($courseId, $canvasUserId);

        return response()->success([
            'assessmentsWithAttempts' => $assessmentsWithAttempts,
            'courseContext' => $courseContext,
            'user' => $user,
            'sourcedId' => $sourcedId
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

        $student = $request->student;
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
    * Mark an attempt as launched, authenticating with an API token
    *
    * @param  int  $assessment_id
    * @return attempt ID, attempt type, and optional API token in a JSON Response
    */

    public function launchAttempt($assessment_id, Request $request)
    {
        $attemptId = $request->input('attemptId');
        $attempt = Attempt::findOrFail($attemptId);
        $student = $attempt->student;
        $nonce = $request->input('nonce');
        $preview = $request->input('preview');
        $studentId = $request->input('studentId');
        $groupName = null;

        //if a preview/anonymous, no need to authenticate
        if ($preview === "true") {
            //if user refreshes, create a new attempt; when a preview, no additional launch data needed,
            //no sensitive data here and so nothing to check/authenticate
            if ($attempt->isLaunched()) {
                $attempt = new Attempt;
                $attempt->initAnonymousAttempt($assessment_id);
            }

            $anonymous = true;
            $attempt->launchAttempt($anonymous);
            return response()->success(['attemptId' => $attempt->id]);
        }

        
        if (!$nonce) {
            abort(403, 'LTI nonce required to authenticate attempt.');
        }

        if ($nonce != $attempt->getNonce()) {
            abort(403, 'Unauthorized attempt launch: nonce mismatch.');
        }

        //if attempt already started, authenticated student is restarting the QC, copy to new attempt
        if ($attempt->isLaunched()) {
            //student ID passed from back-end required on restarts so iframe url can't be shared with other users
            if (!$studentId) {
                abort(403, 'Unauthorized attempt launch.');
            }

            $attempt = $attempt->replicate();
            $attempt->reset();
        }
        
        $attempt->launchAttempt();
        if (!$studentId) {
            $studentId = $student->id;
        }

        //get group information, if necessary; only provided if custom activity has group in request
        if ($request->has('group')) {
            $groupName = $attempt->getGroupName($attemptType);
        }

        $caliperData = $attempt->getCaliperData();
        $timeoutRemaining = $attempt->getTimeoutRemaining($assessment_id, $student->id);

        //determine attempt limit, if applicable
        $allowedAttempts = $attempt->getAllowedAttempts();
        $attemptNumber = $attempt->getAttemptNumber();

        $data = [
            'nonce' => $nonce,
            'attemptId' => $attempt->id,
            'caliper' => $caliperData,
            'groupName' => $groupName,
            'timeoutRemaining' => $timeoutRemaining,
            'studentId' => $studentId,
            'allowedAttempts' => $allowedAttempts,
            'attemptNumber' => $attemptNumber
        ];

        return response()->success($data);
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
