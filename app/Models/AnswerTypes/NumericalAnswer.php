<?php
namespace App\Models\AnswerTypes;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;

class NumericalAnswer extends QuestionOption {
    protected $table = 'numerical_answers';
    protected $fillable = [
        'question_id',
        'answer_type',
        'numerical_answer',
        'margin_of_error',
        'range_min',
        'range_max'
    ];

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
        $newOption = new NumericalAnswer();
        $newOption->question_id = $question['id'];
        $newOption->answer_type = $option['answer_type'];

        if ($newOption->answer_type === 'exact') {
            $newOption->numerical_answer = $option['numerical_answer'];
            $newOption->margin_of_error = $option['margin_of_error'];
        }
        else if ($newOption->answer_type === 'range') {
            $newOption->range_min = $option['range_min'];
            $newOption->range_max = $option['range_max'];
        }

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
        $response = [];
        $studentAnswer = $studentAnswer['numerical_answer'];
        if (!is_numeric($studentAnswer)) {
            return false;
        }

        $response['isCorrect'] = $this->checkCorrectness($questionId, $studentAnswer);
        return $response;
    }

    /**
    * Check correctness of student answer
    *
    * @param  int  $questionId
    * @param  []   $studentAnswer
    * @return boolean
    */

    public function checkCorrectness($questionId, $studentAnswer) {
        $possibleAnswers = NumericalAnswer::where('question_id', '=', $questionId)->get();

        foreach ($possibleAnswers as $possibleAnswer) {
            $isCorrect = $this->checkCorrectnessAgainstOption($possibleAnswer, $studentAnswer);
            if ($isCorrect) {
                return true;
            }
        }

        return false;
    }

    /**
    * Check correctness of student answer against a single defined answer option
    *
    * @param  NumericalAnswer   $option
    * @param  []                $studentAnswer
    * @return boolean
    */

    public function checkCorrectnessAgainstOption($option, $studentAnswer) {
        //convert student and DB answers to floats to compare by numer and not by string
        $studentAnswer = floatval($studentAnswer);

        if ($option->answer_type === 'exact') {
            $answer = floatval($option->numerical_answer);
            $marginOfError = floatval($option->margin_of_error);
            $lessThanMax = $studentAnswer <= $answer + $marginOfError ? true : false;
            $greaterThanMin = $studentAnswer >= $answer - $marginOfError ? true : false;
            if ($lessThanMax && $greaterThanMin) {
                return true;
            }
        }
        else if ($option->answer_type === 'range') {
            $rangeMin = floatval($option->range_min);
            $rangeMax = floatval($option->range_max);
            if ($studentAnswer <= $rangeMax && $studentAnswer >= $rangeMin) {
                return true;
            }
        }

        return false;
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
        $options = $this->where('question_id', '=', $questionId)->get();
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
    }

    /**
    * Determine if answer option is an exact answer
    *
    * @return boolean
    */

    public function isExactAnswer() {
        return $this->answer_type === 'exact';
    }

    /**
    * Determine if answer option is within a range
    *
    * @return boolean
    */

    public function isRange() {
        return $this->answer_type === 'range';
    }

    /**
    * Save options when editing a quiz
    *
    * @param  Question  $question
    * @param  []        $updatedQuestion
    * @return void
    */

    public function saveQuestionOptions($question, $updatedQuestion) {
        $numericalAnswer = new NumericalAnswer;
        foreach($updatedQuestion['options'] as $option) {
            if (strpos($option['id'], 'temp')) {
                $numericalAnswer->addQuestionOption($question, $option);
            }
            else {
                $numericalAnswer->updateQuestionOption($option);
            }
        }

        $numericalAnswer->deleteRemovedQuestionOptions($updatedQuestion);
    }

    /**
    * Search option text for a search term
    *
    * @param  string  $searchTerm
    * @return boolean
    */

    public function search($searchTerm) {
        //for a numerical question, it's inherently not a string, so return false
        //by default; keeping this function so it follows the answer option interface
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
        $updatedOption = $this->find($option['id']);
        $updatedOption->answer_type = $option['answer_type'];

        if ($updatedOption->answer_type === 'exact') {
            $updatedOption->numerical_answer = $option['numerical_answer'];
            $updatedOption->margin_of_error = $option['margin_of_error'];
            //make sure these are nulled out, in case changing answer type
            $updatedOption->range_min = NULL;
            $updatedOption->range_max = NULL;
        }
        else if ($updatedOption->answer_type === 'range') {
            $updatedOption->range_min = $option['range_min'];
            $updatedOption->range_max = $option['range_max'];
            //make sure these are nulled out, in case changing answer type
            $updatedOption->numerical_answer = NULL;
            $updatedOption->margin_of_error = 0;
        }

        $updatedOption->save();
    }
}
