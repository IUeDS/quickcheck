<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('events');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('attempt_id')->unsigned();
            $table->string('group_code', 255);
            $table->string('content_code', 255);
            $table->string('event_type', 255);
            $table->string('event_label', 255);
            $table->float('x')->nullable()->default(NULL);
            $table->float('y')->nullable()->default(NULL);
            $table->dateTime('timestamp');
            $table->text('data');
            $table->timestamps();

            $table->foreign('attempt_id')->references('id')->on('attempts')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }
}
