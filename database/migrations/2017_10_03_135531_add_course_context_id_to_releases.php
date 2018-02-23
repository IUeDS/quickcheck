<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\Release;
use App\Models\CourseContext;

class AddCourseContextIdToReleases extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('releases', function (Blueprint $table) {
            $table->integer('course_context_id')->unsigned()->after('assessment_id')->nullable()->default(NULL);
            $table->foreign('course_context_id')->references('id')->on('course_contexts')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        //populate table with matching course contexts, don't update timestamps
        $releases = Release::all();
        foreach($releases as $release) {
            $ltiContext = $release->lti_context_id;
            $courseContext = CourseContext::where('lti_context_id', '=', $ltiContext)->first();
            if ($courseContext){
                $release->course_context_id = $courseContext->id;
                $release->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('releases', function (Blueprint $table) {
            $table->dropForeign('releases_course_context_id_foreign');
            $table->dropColumn('course_context_id');
        });
    }
}
