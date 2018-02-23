<?php
namespace App\Models\AnswerTypes;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;

class TextMatchAnswer extends QuestionOption {
    protected $table = 'textmatch_answers';
    protected $fillable = [
        'question_id',
        'textmatch_answer_text'
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
        $newOption = new TextMatchAnswer();
        $newOption->question_id = $question['id']; //from updated or new question in DB
        $newOption->textmatch_answer_text = $option['textmatch_answer_text'];
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
        $isCorrect = false;

        $studentAnswer = TextMatchAnswer::formatAnswer($studentAnswer['textmatch_answer']);
        //textmatch allows multiple possible answers
        $possibleAnswers = TextMatchAnswer::where('question_id', '=', $questionId)->get();
        foreach($possibleAnswers as $possibleAnswer) {
            $answer = $possibleAnswer->textmatch_answer_text;
            $answer = strtolower(trim($answer));
            $answer = preg_replace("#[[:punct:]]#", "", $answer);
            if ($studentAnswer === $answer) {
                $isCorrect = true;
            }
        }

        //if no matches found, return false
        $response['isCorrect'] = $isCorrect;
        return $response;
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
    * Format student answer by removing extra whitespace, punctuation, etc.
    *
    * @param  []  $studentAnswer
    * @return string
    */

    public static function formatAnswer($studentAnswer) {
        //format student answer -- lowercase, no leading/trailing whitespace, no punctuation
        $formattedAnswer = strtolower(trim($studentAnswer));
        //strip punctuation, second answer: http://stackoverflow.com/questions/5233734/how-to-strip-punctuation-in-php
        $formattedAnswer = preg_replace("#[[:punct:]]#", "", $formattedAnswer);
        return $formattedAnswer;
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
    * Save options when editing a quiz
    *
    * @param  Question  $question
    * @param  []        $updatedQuestion
    * @return void
    */

    public function saveQuestionOptions($question, $updatedQuestion) {
        $textMatchAnswer = new TextMatchAnswer;
        foreach($updatedQuestion['options'] as $option) {
            if (strpos($option['id'], 'temp')) {
                $textMatchAnswer->addQuestionOption($question, $option);
            }
            else {
                $textMatchAnswer->updateQuestionOption($option);
            }
        }

        $textMatchAnswer->deleteRemovedQuestionOptions($updatedQuestion);
    }

    /**
    * Search option text for a search term
    *
    * @param  string  $searchTerm
    * @return boolean
    */

    public function search($searchTerm) {
        if (strpos(strtolower($this->textmatch_answer_text), $searchTerm) !== false) {
            return true;
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
        $updatedOption = $this->find($option['id']);
        $updatedOption->textmatch_answer_text = $option['textmatch_answer_text'];
        $updatedOption->save();
    }
}
