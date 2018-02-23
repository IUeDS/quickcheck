<?php
namespace App\Models\AnswerTypes;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;
use App\Classes\Analytics\ResponseAnalytics as ResponseAnalytics;

class MatrixAnswer extends QuestionOption {
    protected $table = 'matrix_answers';
    protected $fillable = [
        'question_id',
        'answer_text',
        'row_or_column',
        'matrix_answer_text'
    ];

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Add column to question when editing a quiz
    *
    * @param  []  $question
    * @param  []  $column
    * @return void
    */

    public function addColumn($question, $column) {
        $newColumn = new MatrixAnswer();
        $newColumn->question_id = $question['id'];
        $newColumn->answer_text = $column['answer_text'];
        $newColumn->row_or_column = 'column';
        //no need to save matrix_answer_text, only rows save that info, not columns
        $newColumn->save();
    }

    /**
    * Add row to question when editing a quiz
    *
    * @param  []  $question
    * @param  []  $updatedQuestion
    * @param  []  $row
    * @return void
    */

    public function addRow($question, $updatedQuestion, $row) {
        $newRow = new MatrixAnswer();
        $newRow->question_id = $question['id']; //from updated or new question in DB
        $newRow->answer_text = $row['answer_text'];
        $newRow->row_or_column = 'row';
        $newRow->matrix_answer_text = $this->getRowAnswerTextOnSave($row, $updatedQuestion);
        $newRow->save();
    }

    /**
    * Check a student answer
    *
    * @param  int  $questionId
    * @param  []   $studentAnswer
    * @return []   $response
    */

    public function checkAnswer($questionId, $studentAnswer) {
        $studentAnswers = $studentAnswer['matrix_answers'];
        //check that all rows have been selected, and each row's column selection matches answer text
        $answerOptions = MatrixAnswer::where('question_id', '=', $questionId)->get();
        $rows = [];
        $columns = [];
        $incorrectRows = [];
        $credit = 1;
        $rowCredit = 0;
        $isCorrect = true;
        $response = [];

        foreach ($answerOptions as $answerOption) {
            if ($answerOption->row_or_column == 'column') {
                array_push($columns, $answerOption);
            }
            else {
                array_push($rows, $answerOption);
            }
        }

        $rowCredit = 1 / count($rows);

        //student didn't select all the options (this should be impossible in the UI, but just in case...)
        if (count($studentAnswers) < count($rows)) {
            $isCorrect = false;
        }

        //check to make sure each is correct
        foreach ($studentAnswers as $studentAnswer) {
            $answerRow = null;
            $answerColumn = null;
            //It'd be less lines of code to just query the DB again, but would probably take more processing
            //time than just looping over a few options; these questions are never going to be hundreds of columns
            foreach ($rows as $row) {
                if ($row->id == $studentAnswer['row_id']) {
                    $answerRow = $row;
                }
            }
            foreach ($columns as $column) {
                if ($column->id == $studentAnswer['column_id']) {
                    $answerColumn = $column;
                }
            }
            if (strtolower($answerColumn->answer_text) !== strtolower($answerRow->matrix_answer_text)) {
                $isCorrect = false;
                $credit = $credit - $rowCredit;
                $incorrectRow = [
                    'id' => $answerRow->id,
                    'text' => $answerRow->answer_text
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
        $columns = [];
        $rows = [];

        //initialize each option and filter options into rows/columns
        foreach($options as $option) {
            $option->initializeOption($noAnswers);
            if ($option->isRow()) {
                array_push($rows, $option);
            }
            else {
                array_push($columns, $option);
            }
        }

        //each row has its own nested array of answers so combinations are unique
        foreach($options as &$option) {
            if ($option->isRow()) {
                $option->columns = $columns;
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
        $this['columns'][$answerId]->responseAnalytics->increment();
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
        $matrixAnswer = new MatrixAnswer;
        $matrixAnswer->deleteRemovedQuestionOptions($updatedQuestion);

        //save columns first, so rows can look up answer text by column ID
        foreach ($updatedQuestion['columns'] as $column) {
            if ($this->isNewOption($column['id'])) {
                $matrixAnswer->addColumn($question, $column);
            }
            else {
                $matrixAnswer->updateColumn($column);
            }
        }

        foreach($updatedQuestion['rows'] as $row) {
            if ($this->isNewOption($row['id'])) {
                $matrixAnswer->addRow($question, $updatedQuestion, $row);
            }
            else {
                $matrixAnswer->updateRow($row, $updatedQuestion);
            }
        }
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

        return false;
    }

    /**
    * Set analytics percentage on how many responses selected this option
    *
    * @return void
    */

    public function setAnalyticsPercentage() {
        if ($this->isRow()) {
            foreach($this['columns'] as $column) {
                $column->responseAnalytics->calculatePercentage();
            }
        }
    }

    /**
    * Override abstract parent class's setter function, since nested answer arrays
    * need their own analytics for each possible row/column combination.
    *
    * @param  QuestionAnalytics  $questionAnalytics
    * @return void
    */

    public function setResponseAnalytics($questionAnalytics) {
        if ($this->isRow()) {
            //have to wholesale replace the columns to initialize; otherwise Laravel will grumble about collection
            //override methods and such
            $columns = [];
            foreach($this->columns as $column) {
                $newColumn = clone $column; //ensure answer is not passed by reference
                $newColumn->responseAnalytics = new ResponseAnalytics($questionAnalytics);
                array_push($columns, $newColumn);
            }
            $this->columns = collect($columns)->keyBy('id');
        }
    }

    /**
    * Update existing row when editing a quiz
    *
    * @param  []  $row
    * @param  []  $updatedQuestion
    * @return void
    */

    public function updateRow($row, $updatedQuestion) {
        $updatedRow = $this->find($row['id']);
        $updatedRow->answer_text = $row['answer_text'];
        $updatedRow->matrix_answer_text = $this->getRowAnswerTextOnSave($row, $updatedQuestion);

        $updatedRow->save();
    }

    /**
    * Update existing column when editing a quiz
    *
    * @param  []  $column
    * @return void
    */

    public function updateColumn($column) {
        $updatedColumn = $this->find($column['id']);
        $updatedColumn->answer_text = $column['answer_text'];
        $updatedColumn->save();
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * When editing a quiz, find row's corresponding answer text from the column that matches;
    * this function is used for new options that have not yet been saved to the database.
    *
    * @param  int  $columnId
    * @param  []   $updatedQuestion
    * @return string
    */

    private function findAnswerTextFromNewColumns($columnId, $updatedQuestion)
    {
        foreach($updatedQuestion['columns'] as $column) {
            if ($column['id'] == $columnId) {
                return $column['answer_text'];
            }
        }

        //if corresponding answer text not found
        abort(500, 'There was a problem saving a matrix question. Please make sure each matrix row has a corresponding column answer.');
    }

    /**
    * When editing a quiz, find the row's corresponding answer text from the column that matches
    *
    * @param  []  $row
    * @param  []  $updatedQuestion
    * @return string
    */

    private function getRowAnswerTextOnSave($row, $updatedQuestion)
    {
        $columnId = $row['columnAnswerId'];
        if ($this->isNewOption($columnId)) {
            $answerText = $this->findAnswerTextFromNewColumns($columnId, $updatedQuestion);
        }
        else {
            $answerText = MatrixAnswer::find($columnId)->answer_text;
        }
        return $answerText;
    }

    /**
    * Determine if the answer option is a row or a column
    *
    * @return boolean
    */

    private function isRow() {
        if ($this->row_or_column === 'row') {
            return true;
        }
        else {
            return false;
        }
    }
}