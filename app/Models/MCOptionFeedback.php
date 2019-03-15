<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;

class McOptionFeedback extends Eloquent {
    protected $table = 'mc_option_feedback';
    protected $fillable = [
        'mc_answer_id',
        'feedback_text'
    ];

    public function McAnswer() {
        return $this->belongsTo('App\Models\AnswerTypes\MCAnswer');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Copy feedback as part of a larger full-assessment copy
    *
    * @param  int  $optionId
    * @return void
    */

    public function copy($optionId) {
        $newFeedback = $this->replicate();
        $newFeedback->mc_answer_id = $optionId;
        $newFeedback->save();
    }

    /**
    * Get feedback based on a student's answer
    *
    * @param  []        $studentAnswer
    * @param  Question  $question
    * @return McOptionFeedback
    */

    public function getFeedbackForAnswer($studentAnswer, $question) {
        $feedback = [];
        //only multiple choice/correct questions have per-response feedback
        if (array_key_exists('mc_answer_id', $studentAnswer)) {
            $feedback = $this->where('mc_answer_id', '=', $studentAnswer['mc_answer_id'])->get()->all();
        }
        else if (array_key_exists('mcorrect_answer_ids', $studentAnswer)) {
            //pass array of all options selected
            $selectedIds = $studentAnswer['mcorrect_answer_ids'];
            $unsortedFeedback = $this->whereIn('mc_answer_id', $selectedIds)->get()->all();
            //make sure feedback is retrieved in same order as it was sent in, for shuffled answers
            $feedback = array_map(function($selectedId) use ($unsortedFeedback) {
                foreach($unsortedFeedback as $feedback) {
                    if ($selectedId == $feedback->mc_answer_id) {
                        return $feedback;
                    }
                }
            }, $selectedIds);
        }

        return $feedback;
    }

    /**
    * Search feedback text for a search term
    *
    * @param  string  $searchTerm
    * @return boolean
    */

    public function search($searchTerm) {
        if (strpos(strtolower($this->feedback_text), $searchTerm) !== false) {
            return true;
        }

        return false;
    }
}
