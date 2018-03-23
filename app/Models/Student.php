<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Http\Request;
use Validator;

class Student extends Eloquent {
    protected $table = "students";
    protected $fillable = [
        "lis_person_name_given",
        "lis_person_name_family",
        "lti_user_id",
        "lti_custom_canvas_user_login_id",
        "lti_custom_user_id"
    ];

    public function attempts() {
        return $this->hasMany('App\Models\Attempt');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Format student data for a CSV export to be included in a row
    *
    * @param  []  $studentData
    * @return []
    */

    public static function formatExport($studentData)
    {
        $export = $studentData;
        $keysToRemove = ['id', 'updated_at', 'created_at'];
        foreach($keysToRemove as $key) {
            unset($export[$key]);
        }
        return $export;
    }

    /**
    * Return the canvas user ID of the student (numeric)
    *
    * @return int
    */

    public function getCanvasUserId()
    {
        return $this->lti_custom_user_id;
    }

    /**
    * Return the canvas user login ID of the student (string)
    *
    * @return int
    */

    public function getCanvasUserLoginId()
    {
        return $this->lti_custom_canvas_user_login_id;
    }

    /**
    * Initialize a new student
    *
    * @param  Request  $request
    * @return void
    */

    public function initialize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lis_person_name_given' => 'required',
            'lis_person_name_family' => 'required',
            'user_id' => 'required',
            'custom_canvas_user_login_id' => 'required',
            'custom_canvas_user_id' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->error(400, ['Unable to initialize student, required LTI data not supplied on launch.']);
        }

        $this->lis_person_name_given = $request->lis_person_name_given;
        $this->lis_person_name_family = $request->lis_person_name_family;
        $this->lti_user_id = $request->user_id;
        $this->lti_custom_canvas_user_login_id = $request->custom_canvas_user_login_id;
        $this->lti_custom_user_id = $request->custom_canvas_user_id;
        $this->save();
    }
}
