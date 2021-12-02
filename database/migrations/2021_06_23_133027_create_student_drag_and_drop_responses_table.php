<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentDragAndDropResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_drag_and_drop_responses', function (Blueprint $table) {
            $table->id();
            $table->integer('student_response_id')->unsigned();
            $table->bigInteger('droppable_answer_id')->unsigned();
            $table->bigInteger('draggable_answer_id')->unsigned();
            $table->timestamps();
            $table->foreign('student_response_id')->references('id')->on('student_responses')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('droppable_answer_id')->references('id')->on('drag_and_drop_answers')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('draggable_answer_id')->references('id')->on('drag_and_drop_answers')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $table->dropForeign('student_drag_and_drop_responses_student_response_id_foreign');
        $table->dropForeign('student_drag_and_drop_responses_droppable_answer_id_foreign');
        $table->dropForeign('student_drag_and_drop_responses_draggable_answer_id_foreign');
        Schema::dropIfExists('student_drag_and_drop_responses');
    }
}
