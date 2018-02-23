<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterLengthOfAttemptSourcedid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //All of the sourcedids I saw using the new, encrypted format were 572 characters. Going
        //to make it longer just in case.
        Schema::table('attempts', function (Blueprint $table) {
            $table->string('lis_result_sourcedid', 1000)->nullable()->default(NULL)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('attempts', function (Blueprint $table) {
            $table->string('lis_result_sourcedid', 255)->nullable()->default(NULL)->change();
        });
    }
}
