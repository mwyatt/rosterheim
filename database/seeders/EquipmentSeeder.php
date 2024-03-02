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

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        Equipment::insert([
            [
                'name' => 'Sword',
                'description' => 'The sword is often referred to as the king of weapons.',
                'gold' => 10,
            ],
            [
                'name' => 'Light Armor',
                'description' => 'Light armor is a type of armor that is worn on the body to protect it from injury.',
                'gold' => 15,
            ],
        ]);
    }
}
