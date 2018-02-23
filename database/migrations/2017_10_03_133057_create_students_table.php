<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            //although we generally want a first/last name, might be some edge
            //cases, like group accounts, where that info isn't present
            $table->string('lis_person_name_given')->nullable()->default(NULL);
            $table->string('lis_person_name_family')->nullable()->default(NULL);
            $table->string('lti_user_id');
            $table->string('lti_custom_canvas_user_login_id');
            $table->string('lti_custom_user_id');
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
        Schema::drop('students');
    }
}
