<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('responses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            
            $table->integer('attempt_id')->unsigned()->nullable()->default(NULL);
            $table->text('question');
            $table->text('answer')->nullable()->default(NULL);
            $table->text('answer_key')->nullable()->default(NULL);
            $table->integer('is_correct')->unsigned()->nullable()->default(NULL);
            $table->integer('retry_count')->unsigned()->nullable()->default(NULL);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('responses');
    }
}
