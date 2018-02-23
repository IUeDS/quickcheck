<?php
namespace App\Models\AnswerTypes;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;
use App\Models\McOptionFeedback as McOptionFeedback;

class MCAnswer extends QuestionOption {
    protected $table = 'mc_answers';
    protected $fillable = [
        'question_id',
        'answer_text',
        'correct'
    ];

    public function McOptionFeedback() {
        return $this->hasOne('App\Models\McOptionFeedback', 'mc_answer_id', 'id');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Add question option to an existing question and save
    *
    * @param  []  $question
    * @param  []  $option
    * @return void
    */

    public function addQuestionOption($question, $option) {
        $newOption = new MCAnswer();
        $newOption->question_id = $question->id;
        $newOption->answer_text = $option['answer_text'];
        $newOption->correct = $option['correct'];
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
        $isCorrect = false;
        $response = [];

        if (array_key_exists('mc_answer_id', $studentAnswer)) {
            $isCorrect = $this->isMCAnswerCorrect($studentAnswer['mc_answer_id']);
        }
        else {
            $isCorrect = $this->isMCorrectAnswerCorrect($questionId, $studentAnswer['mcorrect_answer_ids']);
        }

        $response['isCorrect'] = $isCorrect;
        return $response;
    }

    /**
    * Copy question option AND any accompanying feedback; overriding abstract function
    *
    * @param  int  $questionId
    * @return void
    */

    public function copy($questionId)
    {
        //replicate the option
        $newOption = $this->replicate();
        $newOption->question_id = $questionId;
        $newOption->save();

        //replicate per-option feedback, if present
        if (!$this->McOptionFeedback) {
            return;
        }

        $this->McOptionFeedback->copy($newOption->id);
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
                $option->delete();
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
        $options = null;
        //just for multiple choice/correct, if we're editing, include per-response feedback, otherwise, for student,
        //don't include the feedback, so they don't get any hints if they're looking at network traffic
        if ($noAnswers) {
            $options = $this->where('question_id', '=', $questionId)->get();
        }
        else {
            $options = $this->where('question_id', '=', $questionId)->with('McOptionFeedback')->get();
        }
        foreach($options as $option) {
            $option->initializeOption($noAnswers);
        }

        return $options;
    }

    /**
    * Increment analytics for number of student responses to select this option
    *
    * @param  []  $optionIds
    * @return void
    */

    public function incrementAnalytics($optionIds) {
        foreach ($optionIds as $optionId) {
            $this->responseAnalytics->increment();
        }
    }

    /**
    * Initialize option for delivering to front-end
    *
    * @param  boolean  $noAnswers
    * @return void
    */

    public function initializeOption($noAnswers) {
        //not much additional setup required for multiple choice/correct
        if ($noAnswers) {
            unset($this->correct);
        }
        else {
            //prevent errors on front-end if no choice-specific feedback present (null array creates problems)
            if (!count($this->McOptionFeedback)) {
                unset($this->McOptionFeedback);
            }
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
        $MCAnswer = new MCAnswer;
        $savedOption = null;
        foreach ($updatedQuestion['options'] as $option) {
            if (strpos($option['id'], 'temp')) {
                $savedOption = $MCAnswer->addQuestionOption($question, $option);
            }
            else {
                $savedOption = $MCAnswer->updateQuestionOption($option);
            }
            $MCAnswer->updateResponseFeedback($option, $savedOption->id);
        }

        $MCAnswer->deleteRemovedQuestionOptions($updatedQuestion);
    }

    /**
    * Search option text for a search term
    *
    * @param  string  $searchTerm
    * @return boolean
    */

    public function search($searchTerm) {
        if (strpos(strtolower($this->answer_text), $searchTerm) !== false) {
            return true;
        }

        if ($this->McOptionFeedback) {
            $results = $this->McOptionFeedback->search($searchTerm);
            if($results) {
                return true;
            }
        }

        return false;
    }

    /**
    * Set analytics percentage on how many responses selected this option
    *
    * @return void
    */

    public function setAnalyticsPercentage() {
        $this->responseAnalytics->calculatePercentage();
    }

    /**
    * Update existing question option when editing a quiz
    *
    * @param  []  $option
    * @return void
    */

    public function updateQuestionOption($option) {
        $existingOption = MCAnswer::find($option['id']);
        $existingOption->answer_text = $option['answer_text'];
        $existingOption->correct = $option['correct'];
        $existingOption->save();
        return $existingOption;
    }

    /**
    * Add/update per-response feedback, if present, when editing a quiz
    *
    * @param  []  $option
    * @param  int $optionId
    * @return void
    */

    public function updateResponseFeedback($option, $optionId) {
        //if existing feedback, delete it and we'll then add what just came through in the data
        McOptionFeedback::where('mc_answer_id', '=', $optionId)->delete();
        if (array_key_exists('mc_option_feedback', $option)) {
            $newFeedback = McOptionFeedback::create([
                'mc_answer_id' => $optionId,
                'feedback_text' => $option['mc_option_feedback']['feedback_text']
            ]);
        }
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Determine if multiple choice answer is correct
    *
    * @param  int  $answerId
    * @return boolean
    */

    private function isMCAnswerCorrect($answerId) {
        $answerOption = MCAnswer::findOrFail($answerId);
        if ($answerOption->correct == 'true') {
            return true;
        }
        else {
            return false;
        }
    }

    /**
    * Determine if multiple correct answer is correct
    *
    * @param  int  $questionId
    * @param  []   $studentAnswer
    * @return boolean
    */

    private function isMCorrectAnswerCorrect($questionId, $studentAnswer) {
        $correctOptions = MCAnswer::where('question_id', '=', $questionId)
            ->where('correct', '=', 'true')
            ->get()
            ->keyBy('id');
        $isCorrect = true;

        //there are two paths to the answer being incorrect:
        //1) the student selected an incorrect option
        //2) the student did not select a correct option
        //thus, make sure counts are the same, and if so, only correct answers are included
        if (count($studentAnswer) !== $correctOptions->count()) {
            $isCorrect = false;
        }
        else {
            foreach($studentAnswer as $selectedOption) {
                if (!$correctOptions->has($selectedOption)) {
                    $isCorrect = false;
                }
            }
        }

        return $isCorrect;
    }
}