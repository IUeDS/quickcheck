<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimestamps extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('assessment_groups', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('attempts', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('collections', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('custom_activities', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('dropdown_answers', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('matching_answers', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('matrix_answers', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('mc_answers', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('memberships', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('questions', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('responses', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('textmatch_answers', function (Blueprint $table) {
            $table->timestamps();
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('assessment_groups', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('attempts', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('custom_activities', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('dropdown_answers', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('matching_answers', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('matrix_answers', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('mc_answers', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('memberships', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('responses', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('textmatch_answers', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
    }
}
