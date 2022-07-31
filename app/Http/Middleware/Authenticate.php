<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use App\Classes\Auth\CASFilter;
use App\Classes\Auth\AltCASFilter;
use App\Classes\Auth\LTIFilter;
use App\Models\User;
use Session;

class Authenticate {
    public function handle($request, Closure $next)
    {
        $redirectUrl = false;
        //give priority to LTI authentication
        if ($request->input('id_token')) { //LTI 1.3 launch with JWT token
            $ltiFilter = new LTIFilter($request);
            $redirectUrl = $ltiFilter->dataEntryFilter();
        }
        //otherwise, if not an LTI launch and no session, a few possibilities:
        //1) If making an API call but no session, user was probably already in the app,
        //   and their session expired. Now they're clicking a button of some sort.
        //   We want to send a JSON response so the page shows an error in an alert.
        //2) The user is in LTI app and accessing a view, so redirect to home page with session error
        //3) The user is accessing this through CAS (IU only) in a separate tab instead of through LTI.
        else if (!Session::has('user')) {
            //if an API request, send JSON error message
            if ($request->is('api/*')) {
                return response()->error(403, ['Your session has expired. Please refresh the page.']);
            }
            //if in LTI app and accessing a view, session not valid
            else if ($request->has('context')) {
                $redirectUrl = 'home?sessionexpired=true';
            }
            //if not in LTI app, run through CAS (IU only)
            else {
                $casFilter = new CASfilter;
                if ($casFilter->casEnabled()) {
                    $route = $request->route();
                    $redirectUrl = $casFilter->getRedirectUrl($route);
                }
                else {
                    $redirectUrl = 'ltisessionnotvalid';
                }
            }
        }
        //if user has active session, add user value to request for easy retrieval in controllers/models;
        //if we change the auth structure in the future, such as not using sessions, should be easy enough 
        //to only make the necessary change here and in the manage auth file, and treat user on the request
        //as a black box that can be reused across the rest of the app
        else {
            $user = User::getCurrentUser();
            $request->merge(['user' => $user]);
        }

        if ($redirectUrl) {
            return redirect($redirectUrl);
        }
        else {
            return $next($request);
        }
    }
}
