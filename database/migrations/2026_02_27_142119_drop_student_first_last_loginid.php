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
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('lis_person_name_given');
            $table->dropColumn('lis_person_name_family');
            $table->dropColumn('lti_custom_canvas_user_login_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('lis_person_name_given')->nullable()->default(NULL)->after('lti_custom_user_id');
            $table->string('lis_person_name_family')->nullable()->default(NULL)->after('lti_custom_user_id');;
            $table->string('lti_custom_canvas_user_login_id')->after('lti_custom_user_id');;
        });
    }
};
