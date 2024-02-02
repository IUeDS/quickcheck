<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('course_contexts', function (Blueprint $table) {
            $table->boolean('late_grading_enabled')->nullable()->default(false)->after('lti_custom_course_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_contexts', function (Blueprint $table) {
            $table->dropColumn('late_grading_enabled');
        });
    }
};
