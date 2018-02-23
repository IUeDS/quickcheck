<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentNumericalResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_numerical_responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('student_response_id')->unsigned();
            $table->decimal('student_answer_value', 15, 6);
            //reference question id directly, unlike many of the other question types, since there are no
            //pre-created options to link to (i.e., in multiple choice, selected responses link to the question)
            $table->integer('question_id')->unsigned();
            $table->timestamps();
            $table->foreign('student_response_id')->references('id')->on('student_responses')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('question_id')->references('id')->on('questions')
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
        Schema::drop('student_numerical_responses');
    }
}
