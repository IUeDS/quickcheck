<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CollectionPublicIsFalseByDefault extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //needed to install a composer dependency to use change(), figured it'd be easier to just drop and re-add
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn('public_collection');
        });
        
        Schema::table('collections', function (Blueprint $table) {
            $table->string('public_collection', 255)->default('false')->after('owner');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn('public_collection');
        });
        
        Schema::table('collections', function (Blueprint $table) {
            $table->string('public_collection', 255)->nullable()->default(NULL)->after('owner');
        });
    }
}
