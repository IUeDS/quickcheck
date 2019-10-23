<?php

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\Collection;
use App\Models\Membership;

class PublicMembershipController extends \BaseController
{

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Remove the user's membership in a public collection
    *
    * @param  int  $collectionId
    * @return Response
    */

    public function destroy(Request $request, $collectionId)
    {
        $userId = $request->input('id');
        $membership = Membership::where('collection_id', '=', $collectionId)
            ->where('user_id', '=', $userId)
            ->first();
        if (!$membership) {
            return response()->error(500, ['This user is not a member of this collection']);
        }
        $membership->delete();
        return response()->success();
    }

    /**
    * Store a new membership to a public collection
    *
    * @param  int  $collectionId
    * @return Response (includes new membership)
    */

    public function store(Request $request, $collectionId)
    {
        $userId = $request->input('id');
        $membership = Membership::where('collection_id', '=', $collectionId)
            ->where('user_id', '=', $userId)
            ->first();
        if ($membership) {
            return response()->error(500, ['This user already has access to this collection']);
        }

        $collection = Collection::findOrFail($collectionId); //ensure the collection exists

        $membership = new Membership();
        $membership->user_id = $userId;
        $membership->collection_id = $collectionId;
        $membership->read_only = 'true'; //read-only permissions for public collections
        $membership->save();

        return response()->success(['membership' => $membership->toArray()]);
    }
}
