<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;
use App\Models\CourseContext;

class Release extends Eloquent {
    protected $table = 'releases';
    protected $fillable = [
        'assessment_id',
        'course_context_id'
    ];

    public function assessment() {
        return $this->belongsTo('App\Models\Assessment');
    }

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Determine if a release currently exists for an assessment in a course context
    *
    * @param  int  $assessmentId
    * @param  int  $courseContextId
    * @return Release (or NULL if not existing)
    */

    public function exists($assessmentId, $courseContextId) {
        $existingRelease = $this->where('assessment_id', '=', $assessmentId)
            ->where('course_context_id', '=', $courseContextId)
            ->first();

        return $existingRelease;
    }

    /**
    * Get all releases within a course context
    *
    * @param  string  $lti_context_id
    * @return []
    */

    //get releases with associated assessments
    public function getReleasesForContext($lti_context_id)
    {
        $courseContext = CourseContext::where('lti_context_id', '=', $lti_context_id)->first();

        $releases = Release::with('assessment')
            ->where('course_context_id', '=', $courseContext->id)->get();

        return $releases;
    }
}
