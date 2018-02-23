<?php
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\CustomActivity;

class CustomActivityController extends \BaseController
{
    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Delete a custom activity
    *
    * @param  int  $id
    * @return Response
    */

    public function destroy($id)
    {
        if (!User::isAdmin()) {
            return response()->error(403);
        }

        $customActivity = CustomActivity::findOrFail($id);
        $customActivity->delete();
        return response()->success();
    }

    /**
    * Return all custom activities in the system
    *
    * @return Response
    */

    public function index()
    {
        if (!User::isAdmin()) {
            return response()->error(403);
        }

        $customActivities = CustomActivity::all();
        return response()->success(['customActivities' => $customActivities->toArray()]);
    }

    /**
    * Store a new custom activity
    *
    * @return Response
    */

    public function store(Request $request)
    {
        if (!User::isAdmin()) {
            return response()->error(403);
        }

        $customActivity = CustomActivity::create($request->all());
        return response()->success(['customActivity' => $customActivity->toArray()]);
    }

    /**
    * Update the custom activity
    *
    * @param  int  $id
    * @return Response
    */

    public function update(Request $request, $id)
    {
        if (!User::isAdmin()) {
            return response()->error(403);
        }

        $customActivity = CustomActivity::findOrFail($id);
        $customActivity->update($request->all());
        return response()->success(['customActivity' => $customActivity->toArray()]);
    }
}
