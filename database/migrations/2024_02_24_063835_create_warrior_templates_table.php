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
        Schema::create('warrior_templates', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_hero')->default(false);
            $table->string('type')->unique();
            $table->string('warband_type');
            $table->smallInteger('gold');
            $table->tinyInteger('stat_movement');
            $table->tinyInteger('stat_weapon_skill');
            $table->tinyInteger('stat_ballistic_skill');
            $table->tinyInteger('stat_strength');
            $table->tinyInteger('stat_toughness');
            $table->tinyInteger('stat_wounds');
            $table->tinyInteger('stat_initiative');
            $table->tinyInteger('stat_attacks');
            $table->tinyInteger('stat_leadership');
            $table->tinyInteger('starting_experience')->default(0);
            $table->tinyInteger('experience_available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warrior');
    }
};
