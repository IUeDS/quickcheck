<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Eloquent\Model;

class CreateForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::table('memberships', function(Blueprint $table) {
			$table->foreign('user_id')->references('id')->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('collection_id')->references('id')->on('collections')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('assessment_groups', function(Blueprint $table) {
			$table->foreign('collection_id')->references('id')->on('collections')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('assessments', function(Blueprint $table) {
			$table->foreign('assessment_group_id')->references('id')->on('assessment_groups')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('custom_activity_id')->references('id')->on('custom_activities')
                ->onDelete('set null')
                ->onUpdate('cascade');
		});
        
        Schema::table('questions', function(Blueprint $table) {
			$table->foreign('assessment_id')->references('id')->on('assessments')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('dropdown_answers', function(Blueprint $table) {
			$table->foreign('question_id')->references('id')->on('questions')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('matching_answers', function(Blueprint $table) {
			$table->foreign('question_id')->references('id')->on('questions')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('matrix_answers', function(Blueprint $table) {
			$table->foreign('question_id')->references('id')->on('questions')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('mc_answers', function(Blueprint $table) {
			$table->foreign('question_id')->references('id')->on('questions')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        Schema::table('textmatch_answers', function(Blueprint $table) {
			$table->foreign('question_id')->references('id')->on('questions')
                ->onDelete('cascade')
                ->onUpdate('cascade');
		});
        
        
        Schema::table('attempts', function(Blueprint $table) {
			$table->foreign('assessment_id')->references('id')->on('assessments')
                ->onDelete('set null')
                ->onUpdate('cascade');
		});
        
        Schema::table('responses', function(Blueprint $table) {
			$table->foreign('attempt_id')->references('id')->on('attempts')
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
        
        Schema::table('memberships', function(Blueprint $table) {
			$table->dropForeign('memberships_user_id_foreign');
			$table->dropForeign('memberships_collection_id_foreign');
		});
        
        Schema::table('assessment_groups', function(Blueprint $table) {
			$table->dropForeign('assessment_groups_collection_id_foreign');
		});
        
        Schema::table('assessments', function(Blueprint $table) {
			$table->dropForeign('assessments_assessment_group_id_foreign');
            $table->dropForeign('assessments_custom_activity_id_foreign');
		});
        
        Schema::table('questions', function(Blueprint $table) {
			$table->dropForeign('questions_assessment_id_foreign');
		});
        
        Schema::table('dropdown_answers', function(Blueprint $table) {
			$table->dropForeign('dropdown_answers_question_id_foreign');
		});
        
        Schema::table('matching_answers', function(Blueprint $table) {
			$table->dropForeign('matching_answers_question_id_foreign');
		});
        
        Schema::table('matrix_answers', function(Blueprint $table) {
			$table->dropForeign('matrix_answers_question_id_foreign');
		});
        
        Schema::table('mc_answers', function(Blueprint $table) {
			$table->dropForeign('mc_answers_question_id_foreign');
		});
        
        Schema::table('textmatch_answers', function(Blueprint $table) {
			$table->dropForeign('textmatch_answers_question_id_foreign');
		});
        
        Schema::table('attempts', function(Blueprint $table) {
			$table->dropForeign('attempts_assessment_id_foreign');
		});
        
        Schema::table('responses', function(Blueprint $table) {
			$table->dropForeign('responses_attempt_id_foreign');
		});
    }
}
