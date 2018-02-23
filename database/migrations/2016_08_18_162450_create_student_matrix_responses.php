<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentMatrixResponses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_matrix_responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('student_response_id')->unsigned();
            $table->integer('matrix_row_id')->unsigned();
            $table->integer('matrix_column_id')->unsigned();
            $table->timestamps();
            $table->foreign('student_response_id')->references('id')->on('student_responses')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('matrix_row_id')->references('id')->on('matrix_answers')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('matrix_column_id')->references('id')->on('matrix_answers')
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
        Schema::drop('student_matrix_responses');
    }
}
