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
        Schema::create('warriors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->tinyInteger('qty')->default(1);
            $table->foreignId('warband_id')->constrained('warbands');
            $table->foreignId('warrior_template_id')->constrained('warrior_templates');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warriors');
    }
};
