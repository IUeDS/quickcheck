<?php

namespace App\Http\Controllers;

use App\Classes\ExternalData\CanvasAPI;
use App\Models\CourseContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Log;


class CourseContextController extends \BaseController
{
    public function changeCourseLateGradingPolicy(Request $request, $contextId, $courseId) {
        if (!$courseId) {
            return response()->error(400, ['Course ID is required.']);
        }

        $validator = Validator::make($request->all(), [
            'lateGradingPolicy' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->error(400, ['lateGradingPolicy is required.']);
        }

        $canvasApi = new CanvasAPI;
        $lateGradingPolicy = $canvasApi->getCourseLateGradePolicy($courseId);

        if (!$lateGradingPolicy) {
            return response()->error(500, ['No Late Grading Policy exists for this course in Canvas. Please enable in Canvas in order to enable it in Quick Check.']);
        }
        // Log::info('lateGradingPolicy: ' . $lateGradingPolicy);

        //check to see if user has membership/permissions for this collection
        // $courseContext = CourseContext::findOrFail($courseId);
        $courseContext = CourseContext::where('lti_custom_course_id', '=', $courseId)
            ->where('lti_context_id', '=', $contextId)
            ->first();

        // if (!$courseContext->canUserWrite($request->user)) {
        //     return response()->error(403);
        // }

        $courseContext->late_grading_enabled = $request->lateGradingPolicy;
        $courseContext->save();
        return response()->success(['courseContext' => $courseContext->late_grading_enabled]);;
    }

    /**
    * Return courseContext by contextId
    *
    * @param  contextId (string)
    * @return courseContext
    */
    public function getLtiCourseContext($contextId) {
        if (!$contextId) {
            return response()->error(400, ['Context ID is required.']);
        }

        $courseContext = CourseContext::where('lti_context_id', '=', $contextId)->first();
        return response()->success(['courseContext' => $courseContext]);;
    }

}
