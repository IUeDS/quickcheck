<?php

namespace App\Classes\Questions;

//for now, only used for exporting responses
//constructs a dictionary of answers so they can be fetched in O(1) time rather than doing a
//costly search through multiple foreach loops, database transactions, etc.
class AnswerDictionary {

    private $answers;
    private $questions;

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    public function __construct($questions) {
        foreach ($questions as $question) {
            $this->questions[$question['id']] = $question;
            foreach ($question['options'] as $option) {
                //since each response type has its own table, there is a tiny chance that there would be
                //overlap if the key is the ID; add ID + question type to ensure uniqueness
                $key = $option['id'] . $question['question_type'];
                //attach question ID to response to easily retrieve, again in O(1) time
                $option['question_id'] = $question['id'];
                $this->answers[$key] = $option;
            }
        }
    }

    /**
    * Adds a question to the data structure for including in a single CSV line in an export
    *
    * @param  []  $response
    * @param  int  $optionId
    * @param  string  $questionType
    * @param  int  $questionId
    * @return void
    */

    public function addQuestionToResponse(&$response, $optionId, $questionType, $questionId = null) {
        //textmatch/numerical both reference question id directly (no options to select); others do not
        if (!$questionId) {
            $key = $optionId . $questionType;
            $questionId = $this->answers[$key]['question_id'];
        }
        $question = $this->questions[$questionId];
        $response['question_id'] = $question['id'];
        $response['question_text'] = strip_tags($question['question_text']);
        $response['question_type'] = $question['question_type'];
    }

    /**
    * Determine if an answer is available in the dictionary; can be useful for differentiating
    * between multiple choice/correct, for instance, since keys differ on question type
    *
    * @param  int  $optionId
    * @param  string  $questionType
    * @return boolean
    */

    public function doesAnswerExist($optionId, $questionType) {
        $key = $optionId . $questionType;
        if (array_key_exists($key, $this->answers)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
    * Get a possible answer option within a question
    *
    * @param  int  $optionId
    * @param  string  $questionType
    * @param  string  $answerField (relative to answer option model; i.e., 'option_text' for matching)
    * @return  string  $answer
    */

    public function getAnswer($optionId, $questionType, $answerField) {
        $key = $optionId . $questionType;
        $answer = $this->answers[$key][$answerField];
        return $answer;
    }

    /**
    * Get an answer option
    *
    * @param  int  $optionId
    * @param  string  $questionType
    * @return QuestionOption
    */

    public function getOption($optionId, $questionType) {
        $key = $optionId . $questionType;
        return $this->answers[$key];
    }

    /**
    * Get the ID of the question based on an answer option
    *
    * @param  int  $optionId
    * @param  string  $questionType
    * @return int $questionId
    */

    public function getQuestionIdFromOption($optionId, $questionType) {
        $key = $optionId . $questionType;
        return $this->answers[$key]['question_id'];
    }
}