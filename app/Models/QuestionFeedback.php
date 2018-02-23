<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;

class QuestionFeedback extends Eloquent {
    protected $table = 'question_feedback';
    protected $fillable = [
        'question_id',
        'feedback_text',
        'correct'
    ];

    public function question() {
        return $this->belongsTo('App\Models\Question');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Add feedback to a question (if included) when editing a quiz
    *
    * @param  []   $updatedQuestion
    * @param  int  $questionID
    * @return void
    */

    //when saving a quiz, delete existing feedback and add feedback present in the save data
    public static function addFeedback($updatedQuestion, $questionId) {
        //delete custom feedback on the question level, if it exists; we'll re-add if necessary
        QuestionFeedback::where('question_id', '=', $questionId)->delete();
        if (array_key_exists('question_feedback', $updatedQuestion)) {
            foreach($updatedQuestion['question_feedback'] as $feedback) {
                $newFeedback = new QuestionFeedback();
                $newFeedback->question_id = $questionId;
                $newFeedback->feedback_text = $feedback['feedback_text'];
                $newFeedback->correct = $feedback['correct'];
                $newFeedback->save();
            }
        }
    }

    /**
    * Copy question feedback as part of a larger assessment copy
    *
    * @param  int  $questionId
    * @return void
    */

    public function copy($questionId) {
        $newFeedback = $this->replicate();
        $newFeedback->question_id = $questionId;
        $newFeedback->save();
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
