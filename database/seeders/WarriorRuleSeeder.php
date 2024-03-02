<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentRule;
use App\Models\Rule;
use App\Models\Warband;
use App\Models\Warrior;
use App\Models\WarriorRule;
use App\Models\WarriorTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WarriorRuleSeeder extends Seeder
{
    public function run(): void
    {
        WarriorRule::insert([
            [
                'rule_id' => Rule::where('name', 'Leader')->first()->id,
                'warrior_template_id' => WarriorTemplate::where('type', 'Magister')->first()->id,
            ],
            [
                'rule_id' => Rule::where('name', 'Wizard')->first()->id,
                'warrior_template_id' => WarriorTemplate::where('type', 'Magister')->first()->id,
            ],
        ]);
    }
}
