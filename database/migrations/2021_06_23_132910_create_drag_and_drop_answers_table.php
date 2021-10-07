<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDragAndDropAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('drag_and_drop_answers', function (Blueprint $table) {
            $table->id();
            $table->integer('question_id')->unsigned();
            $table->string('type');
            $table->integer('count')->default(1);
            $table->integer('width')->default(NULL)->nullable();
            $table->integer('height')->default(NULL)->nullable();
            $table->string('img_url')->default(NULL)->nullable();
            $table->string('text')->default(NULL)->nullable();
            $table->integer('font_size')->default(NULL)->nullable();
            $table->integer('left')->default(NULL)->nullable();
            $table->integer('top')->default(NULL)->nullable();
            $table->bigInteger('answer_id')->unsigned()->default(NULL)->nullable();
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('questions')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        //can't create foreign key to our own table until after it's created, so put separately
        Schema::table('drag_and_drop_answers', function (Blueprint $table) {
            $table->foreign('answer_id')->references('id')->on('drag_and_drop_answers')
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
        $table->dropForeign('drag_and_drop_answers_question_id_foreign');
        $table->dropForeign('drag_and_drop_answers_answer_id_foreign');
        Schema::dropIfExists('drag_and_drop_answers');
    }
}
