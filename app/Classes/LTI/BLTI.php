<?php

namespace App\Classes\LTI;

use Log;
use Session;
use App\Classes\Oauth\Oauth;
use Illuminate\Http\Request;

class BLTI {

    public $sessionKey = '_basic_lti_context';
    public $valid = false;
    private $request;

    /**
    * Get current context ID from session
    *
    * @return string
    */

    public function getContextId()
    {
        $sessionContext = Session::get($this->sessionKey);
        return $sessionContext['context_id'];
    }

    /**
    * Get all LTI context information from the session
    *
    * @return []
    */

    public function getSessionContext()
    {
        $sessionContext = Session::get($this->sessionKey);
        return $sessionContext;
    }

    /**
    * Initialize LTI context -- verify OAuth and create session
    *
    * @param  string   $secret
    * @param  Request  $request
    * @param  array    $requiredParams
    * @return void
    */

    public function init($secret, $request, $requiredParams)
    {
        $this->request = $request;

        // ensure that we have the correct LTI version
        if (!$this->isBasicLtiRequest() ) {
            return false;
        }

        $this->verifyOauth($secret, $request);
        $this->verifyLaunch($request, $requiredParams);
        $this->initSession();
    }

    /**
    * Determine if the currently logged in user is a course designer
    *
    * @return boolean
    */

    public function isDesigner()
    {
        $sessionContext = $this->getSessionContext();
        $roles = strtolower($sessionContext['roles']);

        if (strpos($roles, "contentdeveloper") !== false) {
            return true;
        }

        return false;
    }

    /**
    * Determine if the currently logged in user is a course instructor
    *
    * @return boolean
    */

    public function isInstructor()
    {
        $sessionContext = $this->getSessionContext();
        $roles = strtolower($sessionContext['roles']);

        if (strpos($roles, "instructor") !== false) {
            return true;
        }

        if (strpos($roles, "administrator") !== false) {
            return true;
        }

        return false;
    }

    /**
    * Determine if the user is currently in an LTI context, via session data
    *
    * @return boolean
    */

    public function isInLtiContext()
    {
        if (Session::has($this->sessionKey)) {
            return true;
        }

        return false;
    }

    /**
    * Determine if necessary LTI data is present for the launch, beyond what's available in BLTI class
    *
    * @param  Request  $request
    * @param  array    $requiredParams
    * @return boolean
    */

    public function isLtiDataPresent(Request $request, $requiredParams)
    {
        foreach($requiredParams as $requiredParam) {
            if (!$request->filled($requiredParam)) {
                Log::error('LTI launch data missing for the following value: ' . $requiredParam);
                return false;
            }
        }

        return true;
    }

    /**
    * Initialize LTI session data
    *
    * @return void
    */

    private function initSession()
    {
        $postData = $this->request->all();
        $launchInfo = [];
        //include oauth consumer key, but not any additional sensitive info
        $launchInfo['oauth_consumer_key'] = $postData['oauth_consumer_key'];

        foreach($postData as $key => $value ) {
            if ($key == "basiclti_submit" || strpos($key, "oauth_") !== false) {
                continue;
            }

            $launchInfo[$key] = $value;
        }

        Session::put('_basic_lti_context', $launchInfo);
    }

    /**
    * Determine if the LTI request information in POST is LTI 1.0 compatible
    *
    * @return boolean
    */

    private function isBasicLtiRequest()
    {
        $messageType = $this->request->input("lti_message_type");
        $ltiVersion = $this->request->input("lti_version");
        $bltiType = "basic-lti-launch-request";
        $contentItemType = "ContentItemSelectionRequest";
        $requiredVersion = "LTI-1p0";

        //ensure values are set
        if (!isset($messageType, $ltiVersion)) {
            return false;
        }

        //ensure correct message type
        if ($messageType != $bltiType && $messageType != $contentItemType) {
            return false;
        }

        //ensure correct LTI version
        if ($ltiVersion != $requiredVersion) {
            return false;
        }

        return true;
    }

    /**
    * Verify that the LTI launch was valid and contained all required params
    *
    * @param  Request  $request
    * @param  array    $requiredParams
    * @return void (or Exception on error)
    */

    private function verifyLaunch(Request $request, $requiredParams)
    {
        if (!$this->valid) {
            abort(403, 'Valid LTI context could not be established. Please contact your instructor to report the problem.');
        }

        //Confirm that we have what we need in the POST. It should be there from the BLTI object init, but be sure.
        if (!$this->isLtiDataPresent($request, $requiredParams)) {
            abort(500, 'A piece of LTI data required for launch is missing. Please refresh the page.');
        }
    }

    /**
    * Verify the OAuth information passed in POST launch
    *
    * @param  string  $secret
    * @return void (or Exception on error)
    */

    private function verifyOauth($secret)
    {
        $oauthConsumerKey = $this->request->input("oauth_consumer_key");
        $oauth = new Oauth($oauthConsumerKey, $this->request, $secret);
        //oauth class will throw an exception and immediately abort if invalid
        $oauth->verify();
        $this->valid = true;
    }
}
