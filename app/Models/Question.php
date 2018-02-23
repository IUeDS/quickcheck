<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;
use App\Classes\Analytics\QuestionAnalytics as QuestionAnalytics;

class Question extends Eloquent {
    protected $table = 'questions';
    protected $fillable = [
        'assessment_id',
        'question_order',
        'question_text',
        'question_type',
        'randomized',
        'multiple_correct'
    ];

    public function assessment() {
        return $this->belongsTo('App\Models\Assessment');
    }

    public function questionFeedback() {
        return $this->hasMany('App\Models\QuestionFeedback');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * For analytics, add incorrect free-form responses to an array
    *
    * @param  StudentResponse  $response
    * @return void
    */

    public function addOtherResponseToAnalytics($response) {
        $this->questionAnalytics->addToOtherResponses($response);
    }

    /**
    * Copy a question
    *
    * @param  int  $assessmentId
    * @return void
    */

    public function copy($assessmentId) {
        //replicate the question
        $newQuestion = $this->replicate();
        $newQuestion->assessment_id = $assessmentId;
        $newQuestion->save();

        //replicate answer options
        $optionModel = QuestionOption::getAnswerModelFromQuestionType($this->question_type);
        $options = $optionModel->where('question_id', '=', $this->id)->get();

        foreach($options as $option) {
            $option->copy($newQuestion->id);
        }

        //replicate feedback (if any)
        foreach($this->questionFeedback as $feedback) {
            $feedback->copy($newQuestion->id);
        }
    }

    /**
    * Create a dictionary of questions for fast retrieval when exporting
    *
    * @param  []  $questions
    * @return []
    */

    public static function createExportQuestionDictionary($questions) {
        $questionDictionary = [];

        foreach ($questions as $question) {
            $key = $question['id'];
            $questionDictionary[$key] = $question;
        }

        return $questionDictionary;
    }

    /**
    * Get all questions for an assessment
    *
    * @param  int  $assessmentId
    * @param  bool $noAnswers
    * @return []
    */

    public static function getAssessmentQuestions($assessmentId, $noAnswers) {
        $questions = Question::where('assessment_id', '=', $assessmentId)
            ->with('QuestionFeedback')
            ->orderBy('question_order')
            ->get();

        foreach($questions as $question) {
            $question->options = $question->getOptions($noAnswers);
        }

        return $questions;
    }

    /**
    * Get the options that belong to a question
    *
    * @param  bool  $noAnswers
    * @return []
    */

    public function getOptions($noAnswers) {
        $optionModel = QuestionOption::getAnswerModelFromQuestionType($this->question_type);
        $options = $optionModel->getOptionsForQuestion($this->id, $noAnswers);
        return $options;
    }

    /**
    * When editing a quiz, retrieve an existing question OR create a new question and return
    *
    * @param  Assessment  $assessment
    * @param  []          $updatedQuestion
    * @return Question
    */

    private function getQuestionToSave($assessment, $updatedQuestion) {
        $question = null;

        if (!strpos($updatedQuestion['id'], 'temp')) { //update existing question
            $question = static::findOrFail($updatedQuestion['id']);
        }
        else { //new question
            $question = static::create(['assessment_id' => $assessment->id]);
        }

        return $question;
    }

    /**
    * Increment analytics for calculating percent correctness on a question
    *
    * @param  []  $studentResponse
    * @return void
    */

    public function incrementAnalytics($studentResponse) {
        $isCorrect = false;
        if (StudentResponse::isCorrect($studentResponse)) {
            $isCorrect = true;
        }
        $this->questionAnalytics->increment($isCorrect);
    }

    /**
    * Save a question based on user input when editing a quiz
    *
    * @param  Assessment  $assessment
    * @param  []          $updatedQuestion
    * @return void
    */

    public function saveQuestion($assessment, $updatedQuestion) {
        $question = $this->getQuestionToSave($assessment, $updatedQuestion);
        $question->updateQuestion($updatedQuestion);
        $questionType = $updatedQuestion['question_type'];
        $questionOption = QuestionOption::getAnswerModelFromQuestionType($questionType);
        $questionOption->saveQuestionOptions($question, $updatedQuestion);
    }

    /**
    * Search question, its options, and its feedback for a search term
    *
    * @param  string  $searchTerm
    * @return Question
    */

    public function search($searchTerm) {
        $resultsFound = false;

        if (strpos(strtolower($this->question_text), $searchTerm) !== false) {
            $resultsFound = true;
        }

        //search options
        $optionModel = QuestionOption::getAnswerModelFromQuestionType($this->question_type);
        $options = $optionModel->where('question_id', '=', $this->id)->get();
        foreach($options as $option) {
            $results = $option->search($searchTerm);
            if ($results) {
                $resultsFound = true;
            }
        }

        //search feedback
        foreach($this->questionFeedback as $feedback) {
            $results = $feedback->search($searchTerm);
            if ($results) {
                $resultsFound = true;
            }
        }

        if (!$resultsFound) {
            return false;
        }

        return $this;
    }

    /**
    * Set the analytics percentage for correctness for a question
    *
    * @return void
    */

    public function setAnalyticsPercentage() {
        $this->questionAnalytics->calculatePercentage();
    }

    /**
    * Initialize question analytics on a question
    *
    * @return void
    */

    public function setQuestionAnalytics() {
        $this->questionAnalytics = new QuestionAnalytics();
    }

    /**
    * Update a question when editing a quiz
    *
    * @param  []  $updatedQuestion
    * @return void
    */

    public function updateQuestion($updatedQuestion) {
        $this->question_order = $updatedQuestion['question_order'];
        $this->question_text = $updatedQuestion['question_text'];
        $this->question_type = $updatedQuestion['question_type'];
        $this->randomized = $updatedQuestion['randomized'];
        $this->multiple_correct = $updatedQuestion['multiple_correct'];
        $this->save();

        QuestionFeedback::addFeedback($updatedQuestion, $this->id);
    }
}
