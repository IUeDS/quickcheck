<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteExtraneousColumnsFromAttempts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attempts', function (Blueprint $table) {
            $table->dropColumn('tracking_id');
            $table->dropColumn('anonymous_url');
            $table->dropColumn('oauth_consumer_key');
            $table->dropColumn('lti_context_id');
            $table->dropColumn('lis_person_name_given');
            $table->dropColumn('lis_person_name_family');
            $table->dropColumn('lti_user_id');
            $table->dropColumn('lti_custom_canvas_user_login_id');
            $table->dropColumn('lti_custom_user_id');
            $table->dropColumn('lti_custom_course_id');
            $table->dropColumn('released_to_student');
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
            $table->string('tracking_id', 10);
            $table->string('anonymous_url', 255)->nullable()->default(NULL);
            $table->string('oauth_consumer_key', 255)->nullable()->default(NULL);
            $table->string('lti_context_id', 50)->nullable()->default(NULL);
            $table->string('lis_person_name_given', 50)->nullable()->default(NULL);
            $table->string('lis_person_name_family', 50)->nullable()->default(NULL);
            $table->string('lti_user_id', 50)->nullable()->default(NULL);
            $table->string('lti_custom_canvas_user_login_id', 50)->nullable()->default(NULL);
            $table->string('lti_custom_user_id', 255)->nullable()->default(NULL);
            $table->string('lti_custom_course_id', 255);
            $table->tinyInteger('released_to_student')->default(0);
        });
    }
}
