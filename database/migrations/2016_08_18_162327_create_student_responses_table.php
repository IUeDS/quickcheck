<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('attempt_id')->unsigned();
            $table->integer('is_correct')->nullable()->default(NULL);
            $table->decimal('partial_credit', 7, 4)->nullable()->default(NULL);
            $table->timestamps();
            $table->foreign('attempt_id')->references('id')->on('attempts')
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
        Schema::drop('student_responses');
    }
}
