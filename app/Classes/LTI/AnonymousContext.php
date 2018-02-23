<?php

namespace App\Classes\LTI;
use Illuminate\Http\Request;

class AnonymousContext
{

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Put a trivial string in the session, so we can check when initializing the attempt that the session
    * is not blank and error out if so. IU Webserve was in some rare cases forgetting the session for no
    * apparent reason, and students were logging anonymous attempts when their attempt was initialized, so
    * we need to check to make sure the session is still there at that point. It's silly that we even have
    * to do such a check, but it's the only way we have to prevent these bizarre infrastructural errors.
    *
    * @param  Route  $route
    * @return void
    */

    public function create(Request $request)
    {
        $request->session()->put('anonymous', true);
    }

    /**
    * Determine if user is currently in an anonymous context (no LTI launch)
    *
    * @return boolean
    */

    public static function isAnonymous(Request $request)
    {
        if ($request->session()->has('anonymous')) {
            return true;
        }
        return false;
    }
}