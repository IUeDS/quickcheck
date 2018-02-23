<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\Attempt;
use App\Models\Student;

class AddStudentIdToAttempts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attempts', function (Blueprint $table) {
            $table->integer('student_id')->unsigned()->nullable()->default(NULL)->after('course_context_id');
            $table->foreign('student_id')->references('id')->on('students')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        //populate new table with existing data
        $attempts = Attempt::groupBy('lti_custom_canvas_user_login_id')->get();
        foreach($attempts as $attempt) {
            $studentId = $attempt->lti_custom_canvas_user_login_id;
            if ($studentId) {
                $student = new Student();
                $student->lis_person_name_given = $attempt->lis_person_name_given;
                $student->lis_person_name_family = $attempt->lis_person_name_family;
                $student->lti_user_id = $attempt->lti_user_id;
                $student->lti_custom_canvas_user_login_id = $attempt->lti_custom_canvas_user_login_id;
                $student->lti_custom_user_id = $attempt->lti_custom_user_id;
                $student->save();

                $studentForeignKey = $student->id;
                //fill in foreign key in each attempt, don't update timestamps
                Attempt::where('lti_custom_canvas_user_login_id', '=', $studentId)
                    ->update(['student_id' => $studentForeignKey]);
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
            $table->dropForeign('attempts_student_id_foreign');
            $table->dropColumn('student_id');
        });
    }
}
