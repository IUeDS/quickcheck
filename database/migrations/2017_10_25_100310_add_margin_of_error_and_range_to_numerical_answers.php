<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMarginOfErrorAndRangeToNumericalAnswers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('numerical_answers', function (Blueprint $table) {
            $table->decimal('numerical_answer', 15, 6)->nullable()->default(NULL)->change();
            $table->string('answer_type')->after('question_id')->default('exact');
            $table->decimal('range_max', 15, 6)->after('numerical_answer')->nullable()->default(NULL);
            $table->decimal('range_min', 15, 6)->after('numerical_answer')->nullable()->default(NULL);
            $table->decimal('margin_of_error', 15, 6)->after('numerical_answer')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('numerical_answers', function (Blueprint $table) {
            $table->decimal('numerical_answer', 15, 6)->change();
            $table->dropColumn('answer_type');
            $table->dropColumn('range_max');
            $table->dropColumn('range_min');
            $table->dropColumn('margin_of_error');
        });
    }
}
