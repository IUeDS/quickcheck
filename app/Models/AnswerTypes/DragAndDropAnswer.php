<?php

namespace App\Models\AnswerTypes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;
use App\Classes\Analytics\ResponseAnalytics as ResponseAnalytics;

class DragAndDropAnswer extends QuestionOption
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
    * @return DragAndDropAnswer
    */

    public function addQuestionOption($question, $option) {
        $newOption = new DragAndDropAnswer();
        $newOption->question_id = $question['id']; //from updated or new question in DB
        $newOption->type = $option['type'];
        $newOption->count = $option['count'];
        $newOption->width = $option['width'];
        $newOption->height = $option['height'];
        $newOption->text = $option['text'];
        $newOption->font_size = $option['font_size'];
        $newOption->left = $option['left'];
        $newOption->top = $option['top'];
        $newOption->answer_id = $option['answer_id'];
        $newOption->img_url = $option['img_url'];
        $newOption->save();

        return $newOption;
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
    * Reusable function to determine if a new or existing option
    *
    * @param  Question  $question
    * @param  []        $option
    * @return DragAndDropAnswer
    */

    public function saveQuestionOption($question, $option) {
        $dragAndDropAnswer = new DragAndDropAnswer;
        $savedOption = null;

        if ($this->isNewOption($option['id'])) {
            $savedOption = $dragAndDropAnswer->addQuestionOption($question, $option);
        }
        else {
            $savedOption = $dragAndDropAnswer->updateQuestionOption($option);
        }

        return $savedOption;
    }

    /**
    * Save options when editing a quiz
    *
    * @param  Question  $question
    * @param  []        $updatedQuestion
    * @return void
    */

    public function saveQuestionOptions($question, $updatedQuestion) {
        $image = $updatedQuestion['image'];
        if ($image) {
            $this->saveQuestionOption($question, $image);
        }

        //MGM: it gets a bit tricky here. Each droppable is required to have an answer ID that points
        //to a draggable, another row in the same table. If the answer ID belongs to a new draggable that
        //has not been saved yet, then the temp ID from the front-end will not be a valid foreign key.
        //We need to save the draggable first to get a valid ID from the DB, but then there will be
        //a mismatch between the temp ID and the valid ID and we won't know what the intended answer is.
        //So we iterate through each draggable, then iterate through each droppable and find the one
        //where the answer ID matches the temp ID (there may be none if the draggable is a distractor).
        //Then we save the draggable, assign the valid ID to the droppable, then save the droppable.
        //A droppable must always have an answer ID and cannot be a distractor, so it will always be saved.
        $draggables = $updatedQuestion['draggables'];
        $droppables = $updatedQuestion['droppables'];
        foreach ($draggables as $draggable) {
            $draggableId = $draggable['id'];
            $draggableSaved = false;
            foreach ($droppables as $droppable) {
                if ($droppable['answer_id'] == $draggableId) {
                    $savedDraggable = $this->saveQuestionOption($question, $draggable);
                    $draggableSaved = true;
                    $droppable['answer_id'] = $savedDraggable->id;
                    $this->saveQuestionOption($question, $droppable);
                }
            }

            //if draggable is a distractor and no match, make sure to still save it
            if (!$draggableSaved) {
                $this->saveQuestionOptions($question, $draggable);
            }
        }

        $this->deleteRemovedQuestionOptions($updatedQuestion);
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
    * @return DragAndDropAnswer
    */

    public function updateQuestionOption($option) {
        //update the prompts
        $existingOption = $this->find($option['id']);
        $existingOption->type = $option['type'];
        $existingOption->count = $option['count'];
        $existingOption->width = $option['width'];
        $existingOption->height = $option['height'];
        $existingOption->text = $option['text'];
        $existingOption->font_size = $option['font_size'];
        $existingOption->left = $option['left'];
        $existingOption->top = $option['top'];
        $existingOption->img_url = $option['img_url'];
        $existingOption->answer_id = $option['answer_id'];
        $existingOption->save();

        return $existingOption;
    }
}
