<?php

namespace App\Models\AnswerTypes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DragAndDropAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'type',
        'count',
        'width',
        'height',
        'img_url',
        'text',
        'font_size',
        'left',
        'top',
        'answer_id'
    ];

    /**
    * Add question option to an existing question and save
    *
    * @param  []  $question
    * @param  []  $option
    * @return void
    */

    public function addQuestionOption($question, $option) {
        $newOption = new DragAndDropAnswer();
        $newOption->question_id = $question['id']; //from updated or new question in DB
        $newOption->type = $option['type'];
        $newOption->count = $option['count'];
        $newOption->width = $option['width'];
        $newOption->height = $option['height'];
        $newOption->img_url = $option['img_url'];
        $newOption->text = $option['text'];
        $newOption->font_size = $option['font_size'];
        $newOption->left = $option['left'];
        $newOption->top = $option['top'];
        $newOption->answer_id = $option['answer_id'];
        $newOption->save();
    }

    /**
    * Check a student answer
    *
    * @param  int  $questionId
    * @param  []   $studentAnswer
    * @return []   $response
    */

    public function checkAnswer($questionId, $studentAnswer) {

    }

    /**
    * If answer options were deleted when saving a quiz, remove them from the database
    *
    * @param  []  $updatedQuestion
    * @return void
    */

    public function deleteRemovedQuestionOptions($updatedQuestion) {
        if (array_key_exists('deletedOptions', $updatedQuestion)) {
            foreach ($updatedQuestion['deletedOptions'] as $deletedOption) {
                $option = $this->find($deletedOption['id']);
                if ($option) {
                    $option->delete();
                }
            }
        }
    }

    /**
    * Get all answer options for a question
    *
    * @param  int      $questionId
    * @param  boolean  $noAnswers
    * @return []       $options
    */

    public function getOptionsForQuestion($questionId, $noAnswers) {

    }

    /**
    * Increment analytics for number of student responses to select this option
    *
    * @param  []  $optionIds
    * @return void
    */

    public function incrementAnalytics($optionIds) {

    }

    /**
    * Initialize option for delivering to front-end
    *
    * @param  boolean  $noAnswers
    * @return void
    */

    public function initializeOption($noAnswers) {
        if ($noAnswers) {
            unset($this->correct);
        }
    }

    /**
    * Save options when editing a quiz
    *
    * @param  Question  $question
    * @param  []        $updatedQuestion
    * @return void
    */

    public function saveQuestionOptions($question, $updatedQuestion) {
        $dragAndDropAnswer = new DragAndDropAnswer;
        foreach ($updatedQuestion['options'] as $option) {
            if (strpos($option['id'], 'temp')) {
                $dragAndDropAnswer->addQuestionOption($question, $option);
            }
            else {
                $dragAndDropAnswer->updateQuestionOption($option);
            }
        }

        $dragAndDropAnswer->deleteRemovedQuestionOptions($updatedQuestion);
    }

    /**
    * Search option text for a search term
    *
    * @param  string  $searchTerm
    * @return boolean
    */

    public function search($searchTerm) {

    }

    /**
    * Set analytics percentage on how many responses selected this option
    *
    * @return void
    */

    public function setAnalyticsPercentage() {

    }

    /**
    * Update existing question option when editing a quiz
    *
    * @param  []  $prompt
    * @return void
    */

    public function updateQuestionOption($option) {
        //update the prompts
        $existingOption = $this->find($option['id']);
        $existingOption->type = $option['type'];
        $existingOption->count = $option['count'];
        $existingOption->width = $option['width'];
        $existingOption->height = $option['height'];
        $existingOption->img_url = $option['img_url'];
        $existingOption->text = $option['text'];
        $existingOption->font_size = $option['font_size'];
        $existingOption->left = $option['left'];
        $existingOption->top = $option['top'];
        $existingOption->answer_id = $option['answer_id'];
        $existingOption->save();
    }
}
