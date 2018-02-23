<?php
use Illuminate\Http\Request;
use App\Models\Collection;
use App\Models\CollectionFeature;

class CollectionFeatureController extends \BaseController
{

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * Get features for a collection
    *
    * @param  int  $collectionId
    * @return Response
    */

    public function getFeatures(Request $request, $collectionId)
    {
        $collection = Collection::find($collectionId);
        $collectionFeatures = $collection->collectionFeatures()->with('feature')->get();
        return response()->success(['features' => $collectionFeatures]);
    }

    /**
    * Update a collection feature to be toggled on or off
    *
    * @param  int  $id
    * @return Response
    */

    public function update(Request $request, $id)
    {
        $featureToUpdate = $request->input('collectionFeature');
        $collectionId = $featureToUpdate['collection_id'];
        $collection = Collection::findOrFail($collectionId);
        if (!$collection->canUserWrite()) {
            return response()->error(403);
        }

        $collectionFeature = CollectionFeature::findOrFail($id);
        $collectionFeature->enabled = $featureToUpdate['enabled'];
        $collectionFeature->save();
        return response()->success();
    }
}
