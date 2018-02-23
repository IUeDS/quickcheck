<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\Attempt;
use App\Models\CourseContext;

class AddCourseContextIdToAttempts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attempts', function (Blueprint $table) {
            $table->integer('course_context_id')->unsigned()->nullable()->default(NULL)->after('assessment_id');
            $table->foreign('course_context_id')->references('id')->on('course_contexts')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        //populate course contexts with existing data
        $attempts = Attempt::groupBy('lti_context_id')->get();
        foreach($attempts as $attempt) {
            $contextId = $attempt->lti_context_id;
            $courseId = $attempt->lti_custom_course_id;
            if ($contextId && $courseId) {
                $courseContext = new CourseContext();
                $courseContext->lti_context_id = $contextId;
                $courseContext->lti_custom_course_id = $courseId;
                $courseContext->save(); //allow timezone to be set to default, EST

                $courseContextId = $courseContext->id;
                //fill in foreign key in each attempt, don't update timestamps
                Attempt::where('lti_context_id', '=', $contextId)
                    ->update(['course_context_id' => $courseContextId]);
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
        Schema::table('attempts', function (Blueprint $table) {
            $table->dropForeign('attempts_course_context_id_foreign');
            $table->dropColumn('course_context_id');
        });
    }
}
