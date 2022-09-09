<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Http\Request;
use Validator;
use Session;
use Log;

class Student extends Eloquent {
    protected $table = "students";
    protected $fillable = [
        "lis_person_name_given",
        "lis_person_name_family",
        "lti_custom_canvas_user_login_id",
        "lti_custom_user_id",
        "lti_person_sourcedid"
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
    * Retrieve student from database by Canvas user ID
    *
    * @param  int $canvasUserId
    * @return Student
    */

    public static function findByCanvasUserId($canvasUserId)
    {
        $student = Student::where('lti_custom_user_id', '=', $canvasUserId)->first();
        if (!$student) {
            abort(500, 'Existing student not found.');
        }

        return $student;
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
    * @return string
    */

    public function getCanvasUserLoginId()
    {
        return $this->lti_custom_canvas_user_login_id;
    }

    /**
    * Return the sourced ID of the student (string)
    *
    * @return string
    */

    public function getLisPersonSourcedId()
    {
        return $this->lis_person_sourcedid;
    }

    /**
    * Get the current logged in student
    *
    * @return Student
    */

    public static function getCurrentStudent() {
        $username = Session::get('student');
        if (!$username) {
            abort(500, 'Session expired.');
        }

        $student = Student::where('lti_custom_canvas_user_login_id', '=', $username)->first();
        if (!$student) {
            Log::error('Student not found in database. User is: ' . $username);
            abort(500, 'Student not found');
        }
        return $student;
    }

    /**
    * Initialize a new student
    *
    * @param  string $givenName
    * @param  string $familyName
    * @param  string $canvasUserId
    * @param  string $canvasLoginId
    * @param  string $personSourcedId
    * @return void
    */

    public function initialize($givenName, $familyName, $canvasUserId, $canvasLoginId, $personSourcedId)
    {
        $this->lis_person_name_given = $givenName;
        $this->lis_person_name_family = $familyName ? $familyName : ''; //service accounts may not have last name, default blank string
        $this->lti_custom_canvas_user_login_id = $canvasLoginId;
        $this->lti_custom_user_id = $canvasUserId;
        $this->lis_person_sourcedid = $personSourcedId;
        $this->save();
    }

    /**
    * Update an existing user to add a sourced ID, which was not formerly saved on this model
    *
    * @param  string $sourcedId
    * @return void
    */

    public function setLisPersonSourcedId($sourcedId)
    {
        $this->lis_person_sourcedid = $sourcedId;
        $this->save();
    }
}
