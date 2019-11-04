<?php

namespace App\Classes\LTI;
use Log;
use App\Models\Attempt;
use App\Classes\Oauth\Oauth;
use App\Exceptions\GradePassbackException;

class Outcome
{
    /*
    E. Scull: This model will handle the getting/putting of grades.
    Returns XML responses from the outcomes service or error strings.


    Example success response from LMS:

    <?xml version="1.0" encoding="UTF-8"?>
    <imsx_POXEnvelopeResponse xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
        <imsx_POXHeader>
            <imsx_POXResponseHeaderInfo>
                <imsx_version>V1.0</imsx_version>
                <imsx_messageIdentifier/>
                <imsx_statusInfo>
                    <imsx_codeMajor>success</imsx_codeMajor>
                    <imsx_severity>status</imsx_severity>
                    <imsx_description/>
                    <imsx_messageRefIdentifier>5419c889c00a8</imsx_messageRefIdentifier>
                    <imsx_operationRefIdentifier>replaceResult</imsx_operationRefIdentifier>
                </imsx_statusInfo>
            </imsx_POXResponseHeaderInfo>
        </imsx_POXHeader>
        <imsx_POXBody><replaceResultResponse/></imsx_POXBody>
    </imsx_POXEnvelopeResponse>


    <?xml version="1.0" encoding="UTF-8"?>
    <imsx_POXEnvelopeResponse xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
        <imsx_POXHeader>
            <imsx_POXResponseHeaderInfo>
                <imsx_version>V1.0</imsx_version>
                <imsx_messageIdentifier>1313355158804</imsx_messageIdentifier>
                <imsx_statusInfo>
                    <imsx_codeMajor>success</imsx_codeMajor>
                    <imsx_severity>status</imsx_severity>
                    <imsx_description>Result read</imsx_description>
                    <imsx_messageRefIdentifier>999999123</imsx_messageRefIdentifier>
                    <imsx_operationRefIdentifier>readResult</imsx_operationRefIdentifier>
                </imsx_statusInfo>
            </imsx_POXResponseHeaderInfo>
        </imsx_POXHeader>
        <imsx_POXBody>
            <readResultResponse>
                <result>
                    <resultScore>
                        <language>en</language>
                        <textString>0.91</textString>
                    </resultScore>
                </result>
            </readResultResponse>
        </imsx_POXBody>
    </imsx_POXEnvelopeResponse>



    */



    private $oauth_consumer_key = null;
    private $oauth_consumer_secret = null;
    private $sourcedid = null;
    private $endpoint = null;
    private $grade = null;

    ///POX (Plain Old XML) setup:
    private $body = '<?xml version = "1.0" encoding = "UTF-8"?>
    <imsx_POXEnvelopeRequest xmlns = "http://www.imsglobal.org/lis/oms1p0/pox">
        <imsx_POXHeader>
            <imsx_POXRequestHeaderInfo>
                <imsx_version>V1.0</imsx_version>
                <imsx_messageIdentifier>MESSAGE</imsx_messageIdentifier>
            </imsx_POXRequestHeaderInfo>
        </imsx_POXHeader>
        <imsx_POXBody>
            <OPERATION>
                <resultRecord>
                    <sourcedGUID>
                        <sourcedId>SOURCEDID</sourcedId>
                    </sourcedGUID>
                    <result>
                        <resultScore>
                            <language>en-us</language>
                            <textString>GRADE</textString>
                        </resultScore>
                    </result>
                </resultRecord>
            </OPERATION>
        </imsx_POXBody>
    </imsx_POXEnvelopeRequest>';

    private $shortBody = '<?xml version = "1.0" encoding = "UTF-8"?>
    <imsx_POXEnvelopeRequest xmlns = "http://www.imsglobal.org/lis/oms1p0/pox">
        <imsx_POXHeader>
            <imsx_POXRequestHeaderInfo>
                <imsx_version>V1.0</imsx_version>
                <imsx_messageIdentifier>MESSAGE</imsx_messageIdentifier>
            </imsx_POXRequestHeaderInfo>
        </imsx_POXHeader>
        <imsx_POXBody>
            <OPERATION>
                <resultRecord>
                    <sourcedGUID>
                        <sourcedId>SOURCEDID</sourcedId>
                    </sourcedGUID>
                </resultRecord>
            </OPERATION>
        </imsx_POXBody>
    </imsx_POXEnvelopeRequest>';

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Determine if response in grade read/passback is due to error
    *
    * @param  string $response
    * @return void
    */

    public function checkForErrors($response = null)
    {
        if ($this->isCanvasDown($response)) {
            $errorMessage = 'The Canvas gradebook is currently unresponsive. Please try again later.';
            throw new GradePassbackException($errorMessage);
        }

        if ($this->isUserNotInCourse($response)) {
            $errorMessage = 'Canvas indicates that you are no longer enrolled in this course and cannot receive a grade.';
            throw new GradePassbackException($errorMessage);
        }

        if ($this->isAssignmentInvalid($response)) {
            $errorMessage = 'Canvas indicates that this assignment is invalid. It may have been closed, deleted, or unpublished after the quick check was opened.';
            throw new GradePassbackException($errorMessage);
        }

        if (strpos($response,'success') === FALSE) {
            Log::error("Outcome.php: Grade was not sent to LMS. LMS returned: " . $response);
            abort(500, 'Error sending grade to LMS.');
        }
    }

    /**
    * Initialize outcome for grade passback
    *
    * @param  string  sourcedId
    * @param  float  $grade (0-1)
    * @return void
    */

    function initialize($sourcedid, $attempt, $grade=null)
    {
        $this->sourcedid = $sourcedid;
        $this->grade = $grade;
        $this->endpoint = $attempt->lis_outcome_service_url;
        $this->oauth_consumer_key = env('LTI_KEY');
        $this->oauth_consumer_secret = env('LTI_SECRET');
    }

    /**
    * Determine if response in grade read/passback is due to invalid assignment,
    * which doesn't require error logging
    *
    * @param  string $response
    * @return boolean
    */

    public function isAssignmentInvalid($response)
    {
        $message = 'Assignment is invalid';
        if (strpos($response, $message) !== false) {
            return true;
        }

        return false;
    }

    /**
    * Determine if grade read/passback error is due to unresponsive LMS,
    * which doesn't require error logging
    *
    * @param  string $response
    * @return boolean
    */
    public function isCanvasDown($response)
    {
        if (!$response) {
            return true;
        }

        if (strpos($response, 'Gateway Time-out')) {
            return true;
        }

        return false;
    }

    /**
    * Determine if response in grade read/passback is due to user not in course,
    * which doesn't require error logging
    *
    * @param  string $response
    * @return boolean
    */
    public function isUserNotInCourse($response)
    {
        $message = 'User is no longer in course';
        if (strpos($response, $message) !== false) {
            return true;
        }

        return false;
    }

    /**
    * Send grade to gradebook
    *
    * @param  string  $sourcedid
    * @param  float  $grade (0-1)
    * @return mixed (bool: true on success, string: error message on failure)
    */

    public function sendGrade($sourcedid, $attempt, $grade, $request)
    {
        if (is_null($grade)) {
            $errorMessage = 'No grade was supplied in this request.';
            throw new GradePassbackException($errorMessage);
        }

        if (is_null($sourcedid)) {
            $errorMessage = 'No sourced ID was supplied in this request.';
            throw new GradePassbackException($errorMessage);
        }

        $this->initialize($sourcedid, $attempt, $grade);
        $operation = 'replaceResultRequest';

        //Plug the values into the POX
        $postBody = str_replace(
            array('SOURCEDID', 'GRADE', 'OPERATION','MESSAGE'),
            array($this->sourcedid, $this->grade, $operation, uniqid()),
            $this->body);

        //since cURL timeout was not working, have to do our own logs of when requests took too long
        $startTime = time();

        //Do the send, signed by OAuth. Capture response.
        $oauth = new Oauth($this->oauth_consumer_key, $request, $this->oauth_consumer_secret);
        $response = $oauth->sendXmlInPost($this->endpoint, $postBody);

        $endTime = time();
        if ($endTime - $startTime > 10) {
            Log::notice('Send grade cURL request took over 10 seconds. Attempt: ' . json_encode($attempt));
        }

        $this->checkForErrors($response); //will throw an exception if an error occurred
        return true;
    }

    /**
    * Read existing grade from gradebook
    *
    * @param  string  $sourcedid
    * @return mixed (float: grade value 0-1 on success, string: error message on failure)
    */

    public function readGrade($sourcedid, $attempt, $request)
    {
        if (is_null($sourcedid)) {
            $errorMessage = 'No sourced ID was supplied in this request.';
            throw new GradePassbackException($errorMessage);
        }

        $this->initialize($sourcedid, $attempt);
        $operation = 'readResultRequest';

        //Plug the values into the POX
        $postBody = str_replace(
            array('SOURCEDID', 'OPERATION','MESSAGE'),
            array($this->sourcedid, $operation, uniqid()),
            $this->shortBody);

        //since cURL timeout was not working, have to do our own logs of when requests took too long
        $startTime = time();

        //Do the send, signed by OAuth. Capture response.
        $oauth = new Oauth($this->oauth_consumer_key, $request, $this->oauth_consumer_secret);
        $response = $oauth->sendXmlInPost($this->endpoint, $postBody);

        $endTime = time();
        if ($endTime - $startTime > 10) {
            Log::notice('Read grade cURL request took over 10 seconds. Attempt: ' . json_encode($attempt));
        }

        $this->checkForErrors($response); //will throw an exception if an error occurred

        $xml = simplexml_load_string($response);
        //E. Scull: xpath expression is trickier than "//resultScore" due to namespace
        $resultScores = $xml->xpath("//*[local-name()='resultScore']");
        if (count($resultScores) !== 1) {
            return false;
        }

        $resultScore = $resultScores[0];
        $grade = $resultScore->textString;
        return $grade;
    }
}
