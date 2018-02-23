<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentCustomResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_custom_responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('student_response_id')->unsigned();
            $table->text('question');
            $table->text('answer')->nullable()->default(NULL);
            $table->text('answer_key')->nullable()->default(NULL);
            $table->integer('retry_count')->unsigned()->nullable()->default(NULL);
            $table->timestamps();
            $table->foreign('student_response_id')->references('id')->on('student_responses')
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
        Schema::drop('student_custom_responses');
    }
}
