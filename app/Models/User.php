<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use App\Classes\ExternalData\CanvasAPI;
use Session;
use Log;

class User extends Eloquent {
    protected $table = 'users';
    protected $fillable = ['admin'];

    public function memberships() {
        return $this->hasMany('App\Models\Membership');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Determine if user already exists
    *
    * @param  string  $username
    * @return boolean
    */

    public static function doesUserExist($username) {
        $result = User::where('username', '=', $username);
        if ($result->count() === 1) {
            return true;
        }

        return false;
    }

    /**
    * Determine if the current logged-in user has admin privileges
    *
    * @return boolean
    */

    public static function isAdmin() {
        $username = Session::get('user');
        $user = User::where('username', '=', $username)->first();
        if (!$user) {
            Log::error('User not found in database. User is: ' . $username);
            abort(500, 'User not found');
        }

        if ($user->admin == 'true') {
            return true;
        }
        else {
            return false;
        }
    }

    /**
    * Save a new user (instructor or staff only)
    *
    * @param  string  $username
    * @return mixed   User on success, false if user already exists
    */

    public static function saveUser($username) {
        $new_user = new User;
        if (User::where('username', '=', $username)->get()->count() > 0) {
            return false;
        }
        else {
            $new_user->username = $username;
            $new_user->save();
            return $new_user;
        }
    }

    /**
    * Get the current logged in user
    *
    * @return User
    */

    public static function getCurrentUser() {
        $username = Session::get('user');
        if (!$username) {
            abort(500, 'Session expired.');
        }

        $user = User::where('username', '=', $username)->first();
        if (!$user) {
            Log::error('User not found in database. User is: ' . $username);
            abort(500, 'User not found');
        }
        return $user;
    }

    /**
    * Get the username of the currently logged-in user
    *
    * @return string
    */

    public static function getCurrentUsername() {
        if (!Session::has('user')) {
            abort(500, 'User not currently logged in.');
            return false;
        }

        return Session::get('user');
    }

    /**
    * Determine if user is a student who has accessed results from the left nav
    *
    * @return boolean
    */

    public static function isStudentViewingResults() {
        if (Session::has('student')) {
            return true;
        }
        return false;
    }

    /**
    * Get a list of all users in a course and their related group information;
    * this is not used in app operations, but instead an auxillary function to
    * enable a CSV download of this information for analytical-minded instructors
    *
    * @param  int  $courseId
    * @return []
    */

    public function getUsersInGroups($courseId) {
        $canvasAPI = new CanvasAPI;
        $users = $canvasAPI->getUsersFromAPI($courseId);
        $users = array_values($users); //convert from hash-indexed to simple array
        $groups = $canvasAPI->getCourseGroups($courseId);
        foreach($groups as &$group) {
            $group['users'] = $canvasAPI->getGroupUsers($group['id']);
        }
        foreach($users as &$user) {
            $user['group'] = $this->matchUserToGroup($user['id'], $groups);
        }
        return $users;
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Match a user to a group in a course, retrieved from the Canvas API
    *
    * @param  int  $userId
    * @param  []   $groups
    * @return string
    */

    private function matchUserToGroup($userId, $groups) {
        foreach($groups as $group) {
            foreach($group['users'] as $user) {
                if ($user['id'] == $userId) {
                    return $group['name'];
                }
            }
        }
        return 'NA';
    }
}
