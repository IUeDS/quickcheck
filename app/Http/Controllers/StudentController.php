<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Classes\ExternalData\CanvasAPI;
use App\Classes\Analytics\Analytics;
use App\Models\Attempt;
use App\Models\CourseContext;
use App\Models\Student;

class StudentController extends \BaseController
{
    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Returns cumulative analytics for student performance in a course context
    *
    * @param  string  $context_id
    * @param  string  $studentId
    * @return success (with [] analytics) or error in a JSON Response
    */

    public function calculateStudentAnalytics($contextId, $studentId) {
        $analytics = new Analytics();
        $studentAnalytics = $analytics->getStudentAnalytics($contextId, $studentId);
        return response()->success(['studentAnalytics' => $studentAnalytics]);
    }

    /**
    * Get all students within an LTI course context
    *
    * @param  string  $context_id
    * @return success (with list of students) or error in a JSON Response
    */

    public function getStudentsByContext($contextId) {
        if (!$contextId) {
            return response()->error(400, ['An LTI context ID was not supplied in this request.']);
        }

        $students = [];
        $courseContext = CourseContext::where('lti_context_id', '=', $contextId)->first();
        $attemptsGroupedByStudent = Attempt::where('course_context_id', '=', $courseContext->id)
            ->groupBy('student_id')
            ->with('student')
            ->get();

        //couldn't find a way in Laravel to detach the parent relationship, which we don't need
        foreach($attemptsGroupedByStudent as $attempt) {
            array_push($students, $attempt->student);
        }

        //sort by last name -- ideally would be more efficient if done directly in the DB,
        //but would require a join to sort by related model and make it difficult to
        //extricate the student from the joined attempt.
        $students = collect($students);
        $students = $students->sortBy('lis_person_name_family')->values()->all();

        return response()->success(['students' => $students]);
    }
}