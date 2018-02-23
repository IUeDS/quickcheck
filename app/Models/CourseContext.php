<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Http\Request;
use App\Classes\ExternalData\CanvasAPI;
use Validator;

class CourseContext extends Eloquent {
    protected $table = "course_contexts";
    protected $fillable = [
        "lti_context_id",
        "lti_custom_course_id",
        "time_zone"
    ];

    public function attempts() {
        return $this->hasMany('App\Models\Attempt');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Format course context information into an array for CSV export
    *
    * @param  []  $courseData
    * @return []
    */

    public static function formatExport($courseData)
    {
        $export = $courseData;
        $keysToRemove = ['id', 'updated_at', 'created_at'];
        foreach($keysToRemove as $key) {
            unset($export[$key]);
        }
        return $export;
    }

    /**
    * Get the Canvas course ID of the course context
    *
    * @return string
    */

    public function getCourseId()
    {
        return $this->lti_custom_course_id;
    }

    /**
    * Get the time zone of the course context
    *
    * @return string
    */

    public function getTimeZone()
    {
        return $this->time_zone;
    }

    /**
    * Initialize a new course context
    *
    * @param  Request  $request
    * @return void
    */

    public function initialize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'context_id' => 'required',
            'custom_canvas_course_id' => 'required'
        ]);
        if ($validator->fails()) {
            $error = 'Unable to initialize course context, required LTI data not supplied on launch.';
            abort(400, $error);
        }

        $this->lti_context_id = $request->context_id;
        $this->lti_custom_course_id = $request->custom_canvas_course_id;
        $this->time_zone = $this->getCourseTimeZoneFromAPI($request->custom_canvas_course_id);
        $this->save();
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * When initializing a new course context, query Canvas API to retrieve course time zone
    *
    * @param  int  $courseId
    * @return string
    */

    private function getCourseTimeZoneFromAPI($courseId)
    {
        $canvasAPI = new CanvasAPI();
        $canvasCourse = $canvasAPI->getCourse($courseId);
        if (!$canvasCourse) {
            $error = 'Unable to initialize course context, course was not found in the Canvas API.';
            abort(500, $error);
        }
        return $canvasCourse['time_zone'];
    }
}
