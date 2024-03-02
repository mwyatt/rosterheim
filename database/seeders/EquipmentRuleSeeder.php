<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentRule;
use App\Models\Rule;
use App\Models\Warband;
use App\Models\Warrior;
use App\Models\WarriorTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentRuleSeeder extends Seeder
{
    public function run(): void
    {
        EquipmentRule::insert([
            [
                'rule_id' => Rule::where('name', 'Parry')->first()->id,
                'equipment_id' => Equipment::where('name', 'Sword')->first()->id,
            ],
        ]);
    }
}
