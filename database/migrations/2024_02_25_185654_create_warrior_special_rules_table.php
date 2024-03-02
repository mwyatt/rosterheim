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
        Schema::create('warrior_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warrior_template_id')->constrained('warrior_templates');
            $table->foreignId('rule_id')->constrained('rules');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warrior_special_rules');
    }
};
