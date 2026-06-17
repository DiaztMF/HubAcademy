<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nisn')->nullable()->unique()->after('email');
            $table->string('class')->nullable()->after('nisn');
            $table->string('major')->nullable()->after('class');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nisn', 'class', 'major']);
        });
    }
};
