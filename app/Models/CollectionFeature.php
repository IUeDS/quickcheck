<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;

class CollectionFeature extends Eloquent {
    protected $table = 'collection_features';
    protected $fillable = [
        'collection_id',
        'feature_id',
        'enabled'
    ];

    public function collection() {
        return $this->belongsTo('App\Models\Collection');
    }

    public function feature() {
        return $this->belongsTo('App\Models\Feature');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * When a collection is created, create the default features and their values
    *
    * @param  int  $collectionId
    * @return boolean (true on success, false on failure)
    */

    public function addDefaultFeatures($collectionId) {
        $features = Feature::all();
        foreach ($features as $feature) {
            $result = $this->addFeature($collectionId, $feature);
            if (!$result) {
                return false;
            }
        }
        return true;
    }

    /**
    * Add a feature to a collection
    *
    * @param  int  $collectionId
    * @param  Feature  $feature
    * @return boolean (true on success, false on failure)
    */

    public function addFeature($collectionId, $feature) {
        $collectionFeature = new CollectionFeature;
        $collectionFeature->collection_id = $collectionId;
        $collectionFeature->feature_id = $feature->id;
        $collectionFeature->enabled = $feature->default_state;
        $result = $collectionFeature->save();

        return $result;
    }

    /**
    * Determine if automatic grade passback is enabled for the collection an assessment belongs to
    *
    * @param  int  $assessmentId
    * @return boolean
    */

    public function isGradePassbackEnabled($assessmentId) {
        return $this->isFeatureEnabled($assessmentId, config('constants.features.AUTOMATIC_GRADE_PASSBACK'));
    }

    /**
    * Determine if empty attempts are hidden for the collection an assessment belongs to
    *
    * @param  int  $assessmentId
    * @return boolean
    */

    public function areEmptyAttemptsHidden($assessmentId) {
        return $this->isFeatureEnabled($assessmentId, config('constants.features.HIDE_EMPTY_ATTEMPTS'));
    }

    /**
    * Determine if responses visible for students for the collection an assessment belongs to
    *
    * @param  int  $assessmentId
    * @return boolean
    */

    public function isViewableResponsesEnabled($assessmentId) {
        return $this->isFeatureEnabled($assessmentId, config('constants.features.STUDENT_VIEW_RESPONSES'));
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Determine if a specific feature is enabled for the collection an assessment belongs to
    *
    * @param  int     $assessmentId
    * @param  string  $name
    * @return boolean
    */

    private function isFeatureEnabled($assessmentId, $name) {
        $assessment = Assessment::find($assessmentId);
        $collectionId = $assessment->assessmentGroup->collection->id;
        $featureId = Feature::where('name', '=', $name)->first()->id;
        $collectionFeature = CollectionFeature::where('collection_id', '=', $collectionId)
            ->where('feature_id', '=', $featureId)
            ->first();
        if ($collectionFeature->enabled === 'true') {
            return true;
        }
        else {
            return false;
        }
    }
}
