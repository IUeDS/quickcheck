<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSessionsLaravel55 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('sessions', function (Blueprint $table) {
            //if a fresh install, no need to run this migration;
            //only needed when updating Laravel from 5.1
            if (Schema::hasColumn('user_id', 'sessions')) {
                return;
            }

            $table->unsignedInteger('user_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropColumn('user_id');
            $table->dropColumn('ip_address');
            $table->dropColumn('user_agent');
        });
    }
}
