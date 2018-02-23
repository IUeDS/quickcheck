<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentDropdownResponses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_dropdown_responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('student_response_id')->unsigned();
            $table->integer('dropdown_prompt_id')->unsigned();
            $table->integer('dropdown_answer_id')->unsigned();
            $table->timestamps();
            $table->foreign('student_response_id')->references('id')->on('student_responses')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('dropdown_prompt_id')->references('id')->on('dropdown_answers')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('dropdown_answer_id')->references('id')->on('dropdown_answers')
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
        Schema::drop('student_dropdown_responses');
    }
}
