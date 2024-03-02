<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(WarriorTemplateSeeder::class);
        $this->call(WarbandSeeder::class);
        $this->call(RuleSeeder::class);
        $this->call(EquipmentSeeder::class);
        $this->call(EquipmentRuleSeeder::class);
        $this->call(WarriorRuleSeeder::class);
    }
}
