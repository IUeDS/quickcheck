<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCollectionFeaturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('collection_features', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('collection_id')->unsigned();
            $table->integer('feature_id')->unsigned();
            $table->string('enabled', 255);
            $table->timestamps();
            
            $table->foreign('collection_id')->references('id')->on('collections')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            
            $table->foreign('feature_id')->references('id')->on('features')
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
        Schema::drop('collection_features');
    }
}
