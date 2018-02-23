<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGroupToCustomActivities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('custom_activities', function (Blueprint $table) {
            $table->string('group_required', 50)->nullable()->default(NULL)->after('developer');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('custom_activities', function (Blueprint $table) {
            $table->dropColumn('group_required');
        });
    }
}
