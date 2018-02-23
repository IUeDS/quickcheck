<?php

namespace App\Classes\LTI;
use Log;
use App\Models\Attempt;

require_once(app_path() . '/OAuth/OAuthBody.php');

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
    private $method="POST";
    private $content_type = "application/xml";
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
    * Send grade to gradebook
    *
    * @param  string  $sourcedid
    * @param  float  $grade (0-1)
    * @return mixed (bool: true on success, string: error message on failure)
    */

    public function sendGrade($sourcedid, $attempt, $grade)
    {
        if (is_null($grade) || is_null($sourcedid)) {
            Log::error("Outcome.php: Grade and/or sourcedid missing. grade: $grade, sourcedid: $sourcedid");
            return 'Grade or Sourced ID missing.';
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
        $response = sendOAuthBodyPOST($this->method, $this->endpoint, $this->oauth_consumer_key, $this->oauth_consumer_secret, $this->content_type, $postBody);

        $endTime = time();
        if ($endTime - $startTime > 10) {
            Log::notice('Send grade cURL request took over 10 seconds. Attempt: ' . json_encode($attempt));
        }

        if (strpos($response,'success') !== FALSE) {
            return true;
        }
        else {
            Log::error("Outcome.php: Grade was not sent to LMS. LMS returned: " . $response);
            abort(500, 'Error sending grade to LMS.');
        }
    }

    /**
    * Read existing grade from gradebook
    *
    * @param  string  $sourcedid
    * @return mixed (float: grade value 0-1 on success, string: error message on failure)
    */

    public function readGrade($sourcedid, $attempt)
    {
        if (!$sourcedid) {
            return false;
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
        $response = sendOAuthBodyPOST($this->method, $this->endpoint, $this->oauth_consumer_key, $this->oauth_consumer_secret, $this->content_type, $postBody);

        $endTime = time();
        if ($endTime - $startTime > 10) {
            Log::notice('Read grade cURL request took over 10 seconds. Attempt: ' . json_encode($attempt));
        }

        if (strpos($response,'success') === false) {
            Log::error("Outcome.php: Grade was not retrieved from the LMS. LMS returned: " . $response);
            return false;
            exit();
        }

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
