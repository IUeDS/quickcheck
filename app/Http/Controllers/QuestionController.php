<?php
use Illuminate\Http\Request;
use App\Classes\Questions\AbstractQuestionOption as QuestionOption;
use App\Models\McOptionFeedback;
use App\Models\Question;
use App\Models\Attempt;
use App\Models\StudentResponse;

class QuestionController extends \BaseController {

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Checks answer correctness and tracks data; records updated attempt/new response
    *
    * @param  int  $id
    * @return Response (includes: feedback, displayedScore, attemptGraded)
    */

    public function submit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'attempt' => 'required',
            'studentAnswer' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->error(400, ['Attempt and student answer data are required.']);
        }

        $clientResponse = [];
        $question = Question::findOrFail($id);

        //check correctness
        $studentAnswer = $request->input('studentAnswer');
        $correctResponse = $this->isAnswerCorrect($studentAnswer, $id);
        $clientResponse = array_merge($clientResponse, $correctResponse);

        //get custom feedback (if applicable)
        $clientResponse['feedback'] = $this->getFeedback($studentAnswer, $question, $correctResponse['isCorrect']);

        //get the attempt (response needs it to foreign key out to it)
        $attemptData = $request->input('attempt');
        $attemptId = $attemptData['id'];
        $attempt = Attempt::findOrFail($attemptId);

        //save the response, with the answer key and partial credit added in
        $isCorrect = $correctResponse['isCorrect'] ? '1' : '0';
        $partialCredit = null;
        if (array_key_exists('credit', $correctResponse)) {
            $partialCredit = $correctResponse['credit'];
        }
        $studentResponse = new StudentResponse;
        $studentResponse->saveResponse($studentAnswer, $attemptId, $isCorrect, $partialCredit, $id);

        //update the attempt
        $attemptResult = $attempt->updateAttempt($attemptData);
        $clientResponse['displayedScore'] = $attemptResult['displayedScore'];

        //return to the client
        return response()->success($clientResponse);
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Get feedback based on student response
    *
    * @param  []  $studentAnswer
    * @param  Question  $question
    * @param  bool  $isCorrect
    * @return Response (includes: feedback, displayedScore, attemptGraded)
    */

    private function getFeedback($studentAnswer, $question, $isCorrect)
    {
        //question-level feedback
        $isCorrect = $isCorrect ? 'true' : 'false'; //convert boolean to string
        $questionFeedback = $question->questionFeedback()->where('correct', '=', $isCorrect)->get()->all();

        //per-option feedback (for now, only applicable to multiple choice/multiple correct)
        $mcOptionFeedback = new McOptionFeedback;
        $optionFeedback = $mcOptionFeedback->getFeedbackForAnswer($studentAnswer, $question);

        $feedback = array_merge($questionFeedback, $optionFeedback);
        return $feedback;
    }

    /**
    * Determine if answer is correct and return associated information to be passed back to client
    *
    * @param  []  $studentAnswer
    * @param  int  $id (question ID)
    * @return [] (includes: correctness, partial credit if applicable, incorrect rows if applicable)
    */

    private function isAnswerCorrect($studentAnswer, $id) {
        $questionType = $studentAnswer['questionType'];
        $questionOption = QuestionOption::getAnswerModelFromQuestionType($questionType);
        $response = $questionOption->checkAnswer($id, $studentAnswer);
        return $response;
    }
}
