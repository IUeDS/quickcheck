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
        Schema::table('drag_and_drop_answers', function (Blueprint $table) {
            $table->string('alt_text')->after('text')->nullable()->default(NULL);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drag_and_drop_answers', function (Blueprint $table) {
            $table->dropColumn('alt_text');
        });
        //
    }
};
