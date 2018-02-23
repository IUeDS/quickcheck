<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttemptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attempts', function (Blueprint $table) {
            
            $table->engine = 'InnoDB';
            
            $table->increments('id');
            
            $table->integer('assessment_id')->unsigned()->nullable()->default(NULL); 
            $table->string('tracking_id', 10);
            
            $table->string('anonymous_url', 255)->nullable()->default(NULL); //Used in lieu of an assessment ID if a custom activity is launched directly, outside the LTI context.
            
            $table->string('oauth_consumer_key', 255)->nullable()->default(NULL); //TODO: Do we need?
            $table->string('lti_context_id', 50)->nullable()->default(NULL);
            $table->string('lis_person_name_given', 50)->nullable()->default(NULL);
            $table->string('lis_person_name_family', 50)->nullable()->default(NULL);
            $table->string('lti_user_id', 50)->nullable()->default(NULL);
            $table->string('lti_custom_canvas_user_login_id', 50)->nullable()->default(NULL);
            $table->string('lti_custom_user_id', 255)->nullable()->default(NULL);
            $table->string('lti_custom_assignment_id', 30)->nullable()->default(NULL);
            $table->string('lti_custom_course_id', 255);
            $table->string('lti_custom_section_id', 255);
            $table->string('lis_outcome_service_url', 255)->nullable()->default(NULL);
            $table->string('lis_result_sourcedid', 255)->nullable()->default(NULL);
            
            $table->string('last_milestone', 255)->nullable()->default(NULL);
            $table->integer('count_correct')->unsigned()->nullable()->default(NULL);
            $table->integer('count_incorrect')->unsigned()->nullable()->default(NULL);
            $table->decimal('calculated_score', 7, 4)->nullable()->default(NULL);
            $table->tinyInteger('complete')->default(0);
            $table->tinyInteger('released_to_student')->default(0);
                        
            $table->string('assignment_title', 255);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('attempts');
    }
}
