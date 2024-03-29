<?php

use App\Classes\ExternalData\CanvasAPI;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends \BaseController
{

    /************************************************************************/
    /* VIEW ENDPOINTS *******************************************************/
    /************************************************************************/

    /**
    * If a user was not found through CAS, ask them to login through LTI
    *
    * @return View
    */

    public function userNotFound()
    {
        return displaySPA();
    }

    /**
    * If a user's session is not valid, most likely due to session expiring
    *
    * @return View
    */

    public function sessionNotValid()
    {
        return displaySPA();
    }

    /**
    * If a user tried to access the app in an iframe but don't have LTI context, they probably went through CAS and
    * have an expired session
    *
    * @return JSON response
    */

    public function ltiSessionNotValid()
    {
        return displaySPA();
    }

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Store a new or existing user as an admin
    *
    * @return Response
    */

    public function addAdmin(Request $request)
    {
        $callingUser = $request->user;
        if (!$callingUser->isAdmin()) {
            return response()->error(403);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->error(400, ['Username is required.']);
        }

        $username = $request->input('username');
        $user = User::where('username', '=', $username)->first();
        if (!$user) {
            $user = User::saveUser($username);
        }
        $user->admin = 'true';
        $user->save();
        return response()->success($user->toArray());
    }

    /**
    * If a user's session is not valid, most likely due to session expiring, and request was made to an API endpoint
    *
    * @return JSON response
    */

    public function apiSessionNotValid()
    {
        return response()->error(403, ['Your session has expired. Please refresh the page.']);
    }

    /**
    * Ensure that user does not have third party cookies blocked
    *
    * @return JSON response
    */

    public function checkCookies(Request $request)
    {
        $sessionData = $request->session()->all();

        //a "_token" value will be set on subsequent requests even if cookies are disabled,
        //so we're checking to make sure that more than just "_token" is set in the session
        if (count($sessionData) > 1) {
            return response()->success();
        }

        return response()->error(400, ['Third party cookies disabled.']);
    }

    /**
    * Return all users in a course from Canvas (to ensure grade passback can be achieved for student)
    *
    * @param  courseId (string)
    * @return Response
    */

    public function getUsersInCourse($courseId) {
        if (!$courseId) {
            return response()->error(400, ['Course ID is required.']);
        }

        //for now, we are fetching users each time an instructor views the attempts for an assessment,
        //to always ensure the info is up to date; but we could also cache this information in the
        //future to lighten the load on the system as a whole if we wanted to. Not a problem for now.
        $canvasAPI = new CanvasAPI;
        $users = $canvasAPI->getUsersFromAPI($courseId);
        return response()->success(['users' => $users]);
    }

    /**
    * Get the currently logged in user
    *
    * @param  None (gets username from session)
    * @return Response
    */

    public function show(Request $request)
    {
        $user = $request->user;
        return response()->success(['user' => $user->toArray()]);
    }

    /**
    * Validate that the user exists in Canvas and return user information
    *
    * @param  Input username
    * @return Response
    */

    public function validateUser(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->error(400, ['Username is required.']);
        }

        $username = $request->input('username');
        $canvasAPI = new CanvasAPI;
        $user = $canvasAPI->getUserFromAPIBySISLogin($username);
        if (array_key_exists('errors', $user)) {
            //NOTE: returning 200 status here instead of a 500, because the response is just saying the username isn't valid
            return response()->error(200, ['reason' => 'Error validating username, please ensure this is the correct user login ID and try again. If you entered an email address, please only include the username.']);
        }
        else {
            return response()->success(['user' => $user]);
        }
    }
}
