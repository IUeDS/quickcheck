<?php

namespace App\Classes\Auth;
use Session;
use App;
use Redirect;
use App\Models\User;

class CASFilter
{

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Determine if CAS is enabled for the app; currently only enabled for Indiana University.
    * For running the app locally, also allow, as we set automatic auth in that case.
    *
    * @return boolean
    */

    public function casEnabled()
    {
        $appUrl = env('APP_URL');
        $currentEnvironment = env('APP_ENV');
        if (strpos($appUrl, 'iu.edu') !== false || $currentEnvironment === 'local' || $currentEnvironment === 'dev') {
            return true;
        }

        return false;
    }

    /**
    * Redirect for CAS authentication
    *
    * @param  Route  $route
    * @return mixed (string: $redirectUrl, if needs redirect; otherwise, bool, false if no redirect needed)
    */

    public function getRedirectUrl($route)
    {
        //See this page for the example: https://github.iu.edu/UITS-IMS/CasIntegrationExamples/blob/master/php_cas_example%203.php
        //KB on CAS: https://kb.iu.edu/d/atfc

        $authenticated = Session::has('CAS');
        $permissionCode = "ANY";
        $baseUrl = env('APP_URL');
        $appUrl = $this->getAppUrl($baseUrl, $route);

        if (App::environment('local')) {
            $this->setLocalAuth();
        }

        if ($this->isLoggedIn()) {
            return false;
        }

        if (!$authenticated || !isset($_GET["casticket"])) {
            return $this->redirectCasLogin($permissionCode, $appUrl);
        }

        $casAnswer = $this->getCasAnswer($permissionCode, $appUrl);
        //split CAS answer into access and user
        list($access,$username) = explode("\n",$casAnswer,2);
        $access = trim($access);
        $username = trim($username);

        if ($access !== "yes") {
            return $baseUrl;
        }

        if (!User::doesUserExist($username)) {
            return 'usernotfound';
        }

        $this->login($username);
        return false;
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Send cURL request for CAS answer
    *
    * @param  string  $permissionCode
    * @param  string  $rootUrl
    * @return [] $casAnswer
    */

    private function getCasAnswer($permissionCode, $rootUrl)
    {
        //set up validation URL to ask CAS if ticket is good
        $_url = 'https://cas.iu.edu/cas/validate';
        $cassvc = $permissionCode;
        $casurl = $rootUrl;
        $params = "cassvc=$cassvc&casticket=$_GET[casticket]&casurl=$casurl";
        $urlNew = "$_url?$params";

        //CAS sending response on 2 lines. First line contains "yes" or "no". If "yes", second line contains username (otherwise, it is empty).
        $ch = curl_init();
        $timeout = 5; // set to zero for no timeout
        curl_setopt ($ch, CURLOPT_URL, $urlNew);
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        ob_start();
        curl_exec($ch);
        curl_close($ch);
        $casAnswer = ob_get_contents();
        ob_end_clean();
        return $casAnswer;
    }

    /**
    * Get app url to redirect back to; can include route params for intended route if user wasn't logged in;
    * i.e., if the user was trying to go to edit a quick check, but their session expired, they can log back
    * in through CAS and get redirected to where they were trying to go, rather than to the default homepage.
    *
    * @param  string  $baseUrl
    * @param  Route  $route
    * @return string $appUrl
    */

    private function getAppUrl($baseUrl, $route)
    {
        $path = $route->uri();
        $param = $route->parameter('id');
        $newPath = str_replace('{id}', $param, $path);
        $appUrl = $baseUrl . "/index.php/" . $newPath;
        return $appUrl;
    }

    /**
    * Check for existing session to see if the user is logged in
    *
    * @return boolean
    */

    private function isLoggedIn()
    {
        //if already logged in, or in local environment, allow user to continue on without CAS redirect
        return Session::get('user') || App::environment('local') ? true : false;
    }

    /**
    * Create session for a newly logged-in user
    *
    * @return void
    */

    private function login($username)
    {
        Session::put('user', $username);
    }

    /**
    * Redirect to the CAS login page if the user is not currently logged in
    *
    * @param  string  $permissionCode
    * @param  string  $rootUrl
    * @return string $redirectUrl
    */

    private function redirectCasLogin($permissionCode, $rootUrl)
    {
        Session::put('CAS', true);
        $redirectUrl = 'https://cas.iu.edu/cas/login?cassvc=' . $permissionCode . '&casurl=' . $rootUrl;
        return $redirectUrl;
    }

    /**
    * Local permissions are a bit different, since redirecting back to localhost creates a CAS error.
    * Add a username that is NOT valid in CAS, but used locally and seeded in database. Set auth = true.
    *
    * @return void
    */

    private function setLocalAuth()
    {
        //locally, you can comment out either Session line below to test what an admin vs. instructor sees
        Session::put('user', 'testinstructor');
        //Session::put('user', 'testadmin');
        $authenticated = true; //if on a local machine for development, skip all the CAS business
    }
}
