<?php
namespace App\Models\AnswerTypes;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;
use App\Classes\Analytics\ResponseAnalytics as ResponseAnalytics;
use Log;

class MatchingAnswer extends QuestionOption {
    protected $table = 'matching_answers';
    protected $fillable = [
        'question_id',
        'option_text',
        'prompt_or_answer',
        'matching_answer_text'
    ];

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Add a distractor option to an existing question and save
    *
    * @param  []  $question
    * @param  []  $distractor
    * @return void
    */

    public function addDistractor($question, $distractor) {
        $newDistractor = new MatchingAnswer();
        $newDistractor->question_id = $question['id']; //from updated or new question in DB
        $newDistractor->option_text = $distractor['option_text'];
        $newDistractor->prompt_or_answer = 'answer';
        $newDistractor->save();
    }

    /**
    * Add question option to an existing question and save
    *
    * @param  []  $question
    * @param  []  $prompt
    * @return void
    */

    public function addQuestionOption($question, $prompt) {
        //save the prompt...
        $newPrompt = new MatchingAnswer();
        $newPrompt->question_id = $question['id']; //from updated or new question in DB
        $newPrompt->option_text = $prompt['option_text'];
        $newPrompt->prompt_or_answer = 'prompt';
        $newPrompt->matching_answer_text = $prompt['matching_answer_text'];
        $newPrompt->save();

        //...and save the matching answer
        $newAnswer = new MatchingAnswer();
        $newAnswer->question_id = $question['id']; //from updated or new question in DB
        $newAnswer->option_text = $prompt['matching_answer_text']; //taken from the prompt's answer field
        $newAnswer->prompt_or_answer = 'answer';
        $newAnswer->save();
    }

    /**
    * Check a student answer
    *
    * @param  int  $questionId
    * @param  []   $studentAnswer
    * @return []   $response
    */

    public function checkAnswer($questionId, $studentAnswer) {
        $studentAnswers = $studentAnswer['matching_answers'];
        $answerOptions = MatchingAnswer::where('question_id', '=', $questionId)->get();
        $prompts = [];
        $answers = [];
        $incorrectRows = [];
        $credit = 1;
        $matchCredit = 0;
        $isCorrect = true;
        $response = [];

        foreach ($answerOptions as $answerOption) {
            if ($answerOption->prompt_or_answer == 'prompt') {
                array_push($prompts, $answerOption);
            }
            else {
                array_push($answers, $answerOption);
            }
        }

        //how much credit per matching answer, for partial credit
        $matchCredit = 1 / count($prompts);

        //student didn't select all the options (this should be impossible in the UI, but just in case...)
        if (count($studentAnswers) < count($prompts)) {
            $isCorrect = false;
        }

        //check to make sure each is correct
        foreach ($studentAnswers as $studentAnswer) {
            $answerPrompt = null;
            $answerSelection = null;
            //It'd be less lines of code to just query the DB again, but would probably take more processing
            //time than just looping over a few options; these questions are never going to be hundreds of columns
            foreach ($prompts as $prompt) {
                if ($prompt->id == $studentAnswer['prompt_id']) {
                    $answerPrompt = $prompt;
                }
            }
            foreach ($answers as $answer) {
                if ($answer->id == $studentAnswer['answer_id']) {
                    $answerSelection = $answer;
                }
            }
            if (strtolower($answerSelection->option_text) !== strtolower($answerPrompt->matching_answer_text)) {
                $isCorrect = false;
                $credit = $credit - $matchCredit;
                $incorrectRow = [
                    'id' => $answerPrompt->id,
                    'text' => $answerPrompt->option_text
                ];
                array_push($incorrectRows, $incorrectRow);
            }
        }

        //only add partial credit if some answers were incorrect; otherwise, score is doubled if isCorrect + partial credit added
        if ($isCorrect) {
            $credit = 0;
        }

        $response['isCorrect'] = $isCorrect;
        $response['incorrectRows'] = $incorrectRows;
        $response['credit'] = $credit;
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
        $options = $this->where('question_id', '=', $questionId)->get();
        $prompts = [];
        $answers = [];

        //initialize each option and filter options into prompts/answers
        foreach($options as $option) {
            $option->initializeOption($noAnswers);
            if ($option->isPrompt()) {
                array_push($prompts, $option);
            }
            else {
                array_push($answers, $option);
            }
        }

        //each prompt has its own nested array of answers so combinations are unique
        foreach($options as &$option) {
            if ($option->isPrompt()) {
                $option->answers = $answers;
            }
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
        $answerId = $optionIds['paired'];
        $this['answers'][$answerId]->responseAnalytics->increment();
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
    * Determine if option is a prompt or answer option
    *
    * @return boolean
    */

    public function isPrompt() {
        if ($this->prompt_or_answer === 'prompt') {
            return true;
        }
        else {
            return false;
        }
    }

    /**
    * Save any distractors included with a question when editing a quiz
    *
    * @param  Question        $question
    * @param  []              $updatedQuestion
    * @param  MatchingAnswer  $matchingAnswer
    * @return void
    */

    public function saveDistractors($question, $updatedQuestion, $matchingAnswer) {
        foreach ($updatedQuestion['distractors'] as $distractor) {
            if (strpos($distractor['id'], 'temp')) {
                $matchingAnswer->addDistractor($question, $distractor);
            }
            else {
                $matchingAnswer->updateDistractor($distractor);
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
        $matchingAnswer = new MatchingAnswer;
        foreach ($updatedQuestion['prompts'] as $prompt) {
            if (strpos($prompt['id'], 'temp')) {
                $matchingAnswer->addQuestionOption($question, $prompt);
            }
            else {
                $matchingAnswer->updateQuestionOption($prompt);
            }
        }

        if (array_key_exists('distractors', $updatedQuestion)) {
            $matchingAnswer->saveDistractors($question, $updatedQuestion, $matchingAnswer);
        }

        $matchingAnswer->deleteRemovedQuestionOptions($updatedQuestion);
    }

    /**
    * Search option text for a search term
    *
    * @param  string  $searchTerm
    * @return boolean
    */

    public function search($searchTerm) {
        if ($this->isPrompt()) {
            if (strpos(strtolower($this->option_text), $searchTerm) !== false) {
                return true;
            }
        }
        else {
            if (strpos(strtolower($this->matching_answer_text), $searchTerm) !== false) {
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
        if ($this->isPrompt()) {
            foreach($this['answers'] as $answer) {
                $answer->responseAnalytics->calculatePercentage();
            }
        }
    }

    /**
    * Override abstract parent class's setter function, since nested answer arrays
    * need their own analytics for each possible prompt/answer combination.
    *
    * @param  QuestionAnalytics  $questionAnalytics
    * @return void
    */

    public function setResponseAnalytics($questionAnalytics) {
        if ($this->isPrompt()) {
            //have to wholesale replace the answers to initialize; otherwise Laravel will grumble about collection
            //override methods and such
            $answers = [];
            foreach($this->answers as $answer) {
                $newAnswer = clone $answer; //ensure answer is not passed by reference
                $newAnswer->responseAnalytics = new ResponseAnalytics($questionAnalytics);
                array_push($answers, $newAnswer);
            }
            $this->answers = collect($answers)->keyBy('id');
        }
    }

    /**
    * Update existing distractor when editing a quiz
    *
    * @param  []  $distractor
    * @return void
    */

    public function updateDistractor($distractor) {
        $existingDistractor = $this->find($distractor['id']);
        $existingDistractor->option_text = $distractor['option_text'];
        $existingDistractor->save();
    }

    /**
    * Update existing question option when editing a quiz
    *
    * @param  []  $prompt
    * @return void
    */

    public function updateQuestionOption($prompt) {
        //update the prompts
        $existingOption = $this->find($prompt['id']);
        $existingOption->option_text = $prompt['option_text'];
        $existingOption->matching_answer_text = $prompt['matching_answer_text'];
        $existingOption->save();

        //update the answers in the dropdowns
        $existingAnswer = $this->find($prompt['matching_answer_id']); //HERE
        $existingAnswer->option_text = $prompt['matching_answer_text'];
        $existingAnswer->save();
    }
}
