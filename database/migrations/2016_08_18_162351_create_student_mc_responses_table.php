<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentMcResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_mc_responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('student_response_id')->unsigned();
            $table->integer('mc_answer_id')->unsigned();
            $table->timestamps();
            $table->foreign('student_response_id')->references('id')->on('student_responses')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('mc_answer_id')->references('id')->on('mc_answers')
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
        Schema::drop('student_mc_responses');
    }
}
