<?php
namespace App\Models\ResponseTypes;
use Illuminate\Database\Eloquent\Model as Eloquent;
use App\Models\StudentResponse;

class StudentCustomResponse extends Eloquent {
    protected $table = 'student_custom_responses';
    protected $fillable = [
        'student_response_id',
        'question',
        'answer',
        'answer_key',
        'retry_count'
    ];

    public function studentResponse() {
        return $this->belongsTo('App\Models\StudentResponse');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Build CSV export array for a student's response
    *
    * @param  []       $studentResponse
    * @param  Attempt  $attempt
    * @return []
    */

    public function buildResponseExport($studentResponse, $attempt) {
        $response = StudentResponse::addGeneralInfoToResponse($studentResponse, $attempt);
        $response['question_id'] = null;
        $response['question_text'] = $studentResponse['custom_responses'][0]['question'];
        $response['question_type'] = 'custom';
        $response['answer'] = $studentResponse['custom_responses'][0]['answer'];
        return $response;
    }

    /**
    * Save a student's answer
    *
    * @param  Request          $request
    * @param  StudentResponse  $studentResponse
    * @return void
    */

    public function saveAnswer($request, $studentResponse) {
        $this->student_response_id = $studentResponse->id;
        $this->question = $request->question;
        $this->answer = $request->answer;
        $this->answer_key = $request->answer_key;
        if ($request->has('retry_count')) {
            $this->retry_count = $request->retry_count;
        }
        $this->save();
    }
}
