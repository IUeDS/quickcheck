<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use App\Classes\Auth\LTIFilter;
use App\Models\Student;
use App\Models\User;
use Session;

class ManageAuthenticate {
    public function handle($request, Closure $next)
    {
        $redirectUrl = false;

        //LTI POST launch
        if ($request->input('id_token')) { //LTI 1.3 launch with JWT token
            $ltiFilter = new LTIFilter($request);
            $redirectUrl = $ltiFilter->manageFilter();
        }
        //student or instructor has been authorized already in LTI post launch;
        //if user has active session, add user value to request for easy retrieval in controllers/models;
        //if we change the auth structure in the future, such as not using sessions, should be easy enough 
        //to only make the necessary change here and in the manage auth file, and treat user on the request
        //as a black box that can be reused across the rest of the app
        else if (Session::has('user')) {
            $user = User::getCurrentUser($request);
            $request->merge(['user' => $user]);
        }
        else if (Session::has('student')) {
            $student = Student::getCurrentStudent();
            $request->merge(['student' => $student]);
        }
        //not an LTI launch and no existing session -- either an intruder, or more likely, the session simply expired
        else {
            if ($request->is('api/*')) { //if an API request, send JSON error message
                $redirectUrl = 'api/sessionnotvalid';
            }
            else { //if a page view, redirect to error page
                $redirectUrl = 'sessionnotvalid';
            }
        }

        if ($redirectUrl) {
            return redirect($redirectUrl);
        }
        else {
            return $next($request);
        }
    }
}
