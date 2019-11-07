<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Classes\Analytics\Analytics as Analytics;
use App\Models\Attempt;
use App\Models\Question;
use App\Models\StudentResponse;
use App\Models\ResponseTypes\StudentCustomResponse;

class StudentResponseController extends \BaseController
{

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Get analytics on student responses for an assessment in an LTI context
    *
    * @param int assessmentId
    * @param string contextId
    * @param int assignmentId
    * @return Response
    */

    public function calculateAnalytics($assessmentId, $contextId, $assignmentId = null)
    {
        if (!$assessmentId || ! $contextId) {
            return response()->error(400, ['Assessment ID and context ID are required']);
        }

        $analytics = new Analytics;
        $responseAnalytics = $analytics->getResponseAnalytics($assessmentId, $contextId, $assignmentId);
        return response()->success(['analytics' => $responseAnalytics]);
    }

    /**
    * Get responses related to an attempt
    *
    * @param int attemptId
    * @return Response
    */

    public function getAttemptResponses($attemptId)
    {
        if (!$attemptId) {
            return response()->error(400, ['Attempt ID is required.']);
        }

        $questions = $this->getQuestionsForAttemptAssessment($attemptId);
        $responses = StudentResponse::getAttemptResponses($attemptId)->toArray();

        return response()->success([
            'questions' => $questions,
            'responses' => $responses
        ]);
    }

    /**
    * Insert a response record (used directly with custom activities)
    *
    * @param int attempt_id
    * @return Response
    */

    public function insertResponse($attempt_id, Request $request)
    {
        if (!$attempt_id) {
            return response()->error(400, ['Attempt ID is required.']);
        }

        $validator = Validator::make($request->all(), [
            'is_correct' => 'required',
            'question' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->error(400, ['Fields is_correct and question are required.']);
        }

        $studentResponse = new StudentResponse;
        $returnData = null;

        //Set the response data:
        $studentResponse->attempt_id = $attempt_id;
        $studentResponse->is_correct = $request->is_correct;
        $studentResponse->save();
        $studentCustomResponse = new StudentCustomResponse;
        $studentCustomResponse->saveAnswer($request, $studentResponse);

        return response()->success();
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Get questions for assessment, answers included, for attempt result view
    *
    * @param   int  $attemptId
    * @return  []   $questions
    */

    private function getQuestionsForAttemptAssessment($attemptId) {
        $assessmentId = Attempt::find($attemptId)->getAssessmentId();
        $questionModel = new Question;
        $noAnswers = false;
        $questions = $questionModel->getAssessmentQuestions($assessmentId, $noAnswers);
        return $questions;
    }
}
