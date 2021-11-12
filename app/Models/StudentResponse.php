<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use App\Models\ResponseTypes\StudentMcResponse;
use App\Models\ResponseTypes\StudentMatchingResponse;
use App\Models\ResponseTypes\StudentDropdownResponse;
use App\Models\ResponseTypes\StudentMatrixResponse;
use App\Models\ResponseTypes\StudentNumericalResponse;
use App\Models\ResponseTypes\StudentTextmatchResponse;
use App\Models\ResponseTypes\StudentDragAndDropResponse;
use App\Models\Student;

class StudentResponse extends Eloquent {
    protected $table = 'student_responses';
    protected $fillable = [
        'attempt_id',
        'is_correct',
        'partial_credit'
    ];

    public function attempt() {
        return $this->belongsTo('App\Models\Attempt');
    }

    public function mcResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentMcResponse');
    }

    public function dropdownResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentDropdownResponse');
    }

    public function matchingResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentMatchingResponse');
    }

    public function matrixResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentMatrixResponse');
    }

    public function numericalResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentNumericalResponse');
    }

    public function textmatchResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentTextmatchResponse');
    }

    public function customResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentCustomResponse');
    }

    public function dragAndDropResponses() {
        return $this->hasMany('App\Models\ResponseTypes\StudentDragAndDropResponse');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * When exporting a responses CSV, include general response and user info
    *
    * @param  []  $studentResponse
    * @param  []  $attempt
    * @return []
    */

    public static function addGeneralInfoToResponse($studentResponse, $attempt) {
        $response = [];
        //include the more general response info
        $response['id'] = $studentResponse['id'];
        $response['attempt_id'] = $studentResponse['attempt_id'];
        $response['is_correct'] = $studentResponse['is_correct'];
        $response['partial_credit'] = $studentResponse['partial_credit'];
        $response['created_at'] = $studentResponse['created_at'];
        //include student first/last and username, so it can be identified without a join
        $student = Student::find($attempt['student_id']);
        $response['lis_person_name_given'] = $student->lis_person_name_given;
        $response['lis_person_name_family'] = $student->lis_person_name_family;
        $response['lti_custom_canvas_user_login_id'] = $student->lti_custom_canvas_user_login_id;
        return $response;
    }

    /**
    * Get all responses that belong to an attempt, including related models
    *
    * @param  int  $attemptId
    * @param  []   $responseTypes
    * @return Collection
    */

    public static function getAttemptResponses($attemptId, $responseTypes = null) {
        //default is to include all possible response types, but a subset can be specified
        //as a parameter. this is particularly useful when retrieving large amounts of
        //analytics, and only the question types involved in the specific quiz are needed.
        $allResponseTypes = ['mcResponses', 'dropdownResponses',
                        'matchingResponses', 'matrixResponses', 'numericalResponses',
                        'textmatchResponses', 'customResponses', 'dragAndDropResponses'];
        $eagerLoading = $responseTypes ? $responseTypes : $allResponseTypes;
        $studentResponses = StudentResponse::with($eagerLoading)->where('attempt_id', '=', $attemptId)->get();
        return $studentResponses;
    }

    /**
    * Return a response model of a specific question type based on the student response
    *
    * @param  []  $studentResponse
    * @return StudentResponseType
    */

    public static function getModelFromStudentResponse($studentResponse) {
        $responseType = StudentResponse::getTypeFromStudentResponse($studentResponse);

        switch ($responseType) {
            case 'mc_responses':
                return new StudentMcResponse();
                break;
            case 'dropdown_responses':
                return new StudentDropdownResponse();
                break;
            case 'matching_responses':
                return new StudentMatchingResponse();
                break;
            case 'matrix_responses':
                return new StudentMatrixResponse();
                break;
            case 'numerical_responses':
                return new StudentNumericalResponse();
                break;
            case 'textmatch_responses':
                return new StudentTextmatchResponse();
                break;
            case 'drag_and_drop_responses':
                return new StudentDragAndDropResponse();
                break;
        }

        //if nothing found -- might happen in the rare case that a previously used
        //answer is deleted and the cascading delete removes the responses.
        return false;
    }

    /**
    * Get all responses for an attempt, excluding specific response question types
    *
    * @param  int  $attemptId
    * @return Collection
    */

    public static function getResponsesForAttempt($attemptId) {
        return StudentResponse::where('attempt_id', '=', $attemptId)->get();
    }

    /**
    * Get related response types based on the question type
    *
    * @param  string  $questionType
    * @return mixed   string on success, false on error
    */

    public static function getResponseRelationshipFromQuestionType($questionType) {
        switch($questionType) {
            case config('constants.questionTypes.MULTCHOICE'):
                return 'mcResponses';
            case config('constants.questionTypes.MULTCORRECT'):
                return 'mcResponses';
            case config('constants.questionTypes.MATCHING'):
                return 'matchingResponses';
            case config('constants.questionTypes.DROPDOWN'):
                return 'dropdownResponses';
            case config('constants.questionTypes.MATRIX'):
                return 'matrixResponses';
            case config('constants.questionTypes.NUMERICAL'):
                return 'numericalResponses';
            case config('constants.questionTypes.TEXTMATCH'):
                return 'textmatchResponses';
            case config('constants.questiontypes.DRAGDROP'):
                return 'draganddropResponses';
            default:
                return false;
        }
    }

    /**
    * Get all possible response types
    *
    * @return []
    */

    public static function getResponseTypes() {
        $responseTypes = [
            'mc_responses',
            'dropdown_responses',
            'matching_responses',
            'matrix_responses',
            'numerical_responses',
            'textmatch_responses',
            'drag_and_drop_responses'
        ];
        return $responseTypes;
    }

    /**
    * Get the response type based on the student response
    *
    * @param  []  $studentResponse
    * @return string
    */

    public static function getTypeFromStudentResponse($studentResponse) {
        $responseTypes = StudentResponse::getResponseTypes();
        $foundResponseType = null;

        foreach ($responseTypes as $responseType) {
            if (array_key_exists($responseType, $studentResponse)) {
                $answerOptions = $studentResponse[$responseType];
                if (count($answerOptions)) {
                    return $responseType;
                }
            }
        }

        return $foundResponseType;
    }

    /**
    * Determine if the response was correct
    *
    * @param  []  $studentResponse
    * @return boolean
    */

    public static function isCorrect($studentResponse) {
        if ($studentResponse['is_correct'] == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
    * Save a student response
    *
    * @param  []     $studentAnswer
    * @param  int    $attemptId
    * @param  int    $isCorrect
    * @param  float  $partialCredit
    * @param  int    $questionId
    * @return bool
    */

    public function saveResponse($studentAnswer, $attemptId, $isCorrect, $partialCredit, $questionId) {
        $this->attempt_id = $attemptId;
        $this->is_correct = $isCorrect;
        if ($partialCredit) {
            $this->partial_credit = $partialCredit;
        }
        $this->save();
        $questionType = $studentAnswer['questionType'];
        $responseTypeModel = $this->getModelFromQuestionType($questionType);
        $responseTypeModel->saveAnswer($this, $studentAnswer, $questionId);

        return true;
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Get the specific response type based on the question type
    *
    * @param  string  $questionType
    * @return mixed   StudentResponseType on success, false on error
    */

    private function getModelFromQuestionType($questionType) {
        switch($questionType) {
            case config('constants.questionTypes.MULTCHOICE'):
                return new StudentMcResponse;
            case config('constants.questionTypes.MULTCORRECT'):
                return new StudentMcResponse;
            case config('constants.questionTypes.MATCHING'):
                return new StudentMatchingResponse;
            case config('constants.questionTypes.DROPDOWN'):
                return new StudentDropdownResponse;
            case config('constants.questionTypes.MATRIX'):
                return new StudentMatrixResponse;
            case config('constants.questionTypes.NUMERICAL'):
                return new StudentNumericalResponse;
            case config('constants.questionTypes.TEXTMATCH'):
                return new StudentTextmatchResponse;
            case config('constants.questionTypes.DRAGDROP'):
                return new StudentDragAndDropResponse;
            default:
                return false;
        }
    }
}
