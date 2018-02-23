<?php

namespace App\Classes\ExternalData;
use Response;
use App\Models\Attempt;
use App\Models\StudentResponse;
use App\Models\ResponseTypes\StudentCustomResponse;

class CSV {

    private $headers;

    //source:
    //http://stackoverflow.com/questions/26146719/use-laravel-to-download-table-as-csv/27596496#27596496
    function __construct($filename = 'download') {
        $this->headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0'
        ,   'Content-type'        => 'text/csv'
        ,   'Content-Disposition' => 'attachment; filename=' . $filename . '.csv'
        ,   'Expires'             => '0'
        ,   'Pragma'              => 'public'
        ];
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Convert an array into CSV format and download
    *
    * @param  []  $list
    * @param  string  $filename
    * @return Response (CSV download)
    */

    public function download($list)
    {
        # add headers for each column in the CSV download
        array_unshift($list, array_keys($list[0]));

        $callback = function() use ($list)
        {
            $FH = fopen('php://output', 'w');
            foreach ($list as $row) {
                fputcsv($FH, $row);
            }
            fclose($FH);
        };

        return Response::stream($callback, 200, $this->headers);
    }

    /**
    * Stream attempts for large CSV downloads
    *
    * @param  Query\Builder  $query
    * @param  CourseContext  $courseContext
    * @return Response (CSV download)
    */

    public function downloadAttempts($query, $courseContext)
    {

        $callback = function() use ($query, $courseContext) {
            $headerColumnsAdded = false;
            $FH = fopen('php://output', 'w');

            $query->chunk(200, function($attempts) use (&$headerColumnsAdded, $FH, $courseContext) {
                set_time_limit(30); //avoid max 30 sec execution time limit errors as we stream
                $formattedAttempts = Attempt::formatExport($attempts, $courseContext);
                if (!$headerColumnsAdded) {
                    array_unshift($formattedAttempts, array_keys($formattedAttempts[0]));
                    $headerColumnsAdded = true;
                }
                foreach($formattedAttempts as $attempt) {
                    fputcsv($FH, $attempt);
                }
            });

            fclose($FH);
        };

        return Response::stream($callback, 200, $this->headers);
    }

    /**
    * Stream responses for large CSV downloads
    *
    * @param  Query\Builder  $attemptQuery
    * @param  Assessment  $assessment
    * @param  AnswerDictionary  $answerDictionary
    * @return Response (CSV download)
    */

    public function downloadResponses($attemptQuery, $assessment, $answerDictionary = null)
    {
        $callback = function() use ($attemptQuery, $assessment, $answerDictionary) {
            $headerColumnsAdded = false;
            $FH = fopen('php://output', 'w');

            $attemptQuery->chunk(200, function($attempts) use (&$headerColumnsAdded, $FH, $assessment, $answerDictionary) {
                if ($assessment->isCustomAssessment()) {
                    $responses = $this->exportCustomResponses($attempts);
                }
                else {
                    $responses = $this->exportQuizResponses($attempts, $answerDictionary);
                }
                if (!$headerColumnsAdded) {
                    array_unshift($responses, array_keys($responses[0]));
                    $headerColumnsAdded = true;
                }
                foreach($responses as $response) {
                    fputcsv($FH, $response);
                }
            });

            fclose($FH);
        };

        return Response::stream($callback, 200, $this->headers);
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Translate the response object into plain text for CSV export
    *
    * @param  StudentResponse  $studentResponse
    * @param  AnswerDictionary  $answerDictionary
    * @param  Attempt  $attempt
    * @return string $response
    */

    private function buildResponseInPlainText($studentResponse, $answerDictionary, $attempt)
    {
        $responseModel = StudentResponse::getModelFromStudentResponse($studentResponse);
        $response = $responseModel->buildResponseExport($studentResponse, $attempt, $answerDictionary);
        return $response;
    }

    /**
    * Get all custom responses from their associated attempts
    *
    * @param  []  $attempts
    * @return [] $responses
    */

    private function exportCustomResponses($attempts)
    {
        $responses = [];

        foreach ($attempts as $attempt) {
            $studentResponses = StudentResponse::getAttemptResponses($attempt->id)->toArray();
            foreach ($studentResponses as $studentResponse) {
                $customResponse = new StudentCustomResponse;
                $response = $customResponse->buildResponseExport($studentResponse, $attempt);
                array_push($responses, $response);
            }
        }
        return $responses;
    }

    /**
    * Get all non-custom responses from their associated attempts
    *
    * @param  []  $attempts
    * @param  int  $assessment_id
    * @return [] $responses
    */

    private function exportQuizResponses($attempts, $answerDictionary)
    {
        $responses = [];

        foreach ($attempts as $attempt) {
            $studentResponses = StudentResponse::getAttemptResponses($attempt->id)->toArray();
            foreach($studentResponses as $studentResponse) {
                $response = $this->buildResponseInPlainText($studentResponse, $answerDictionary, $attempt);
                array_push($responses, $response);
            }
        }

        return $responses;
    }
}
