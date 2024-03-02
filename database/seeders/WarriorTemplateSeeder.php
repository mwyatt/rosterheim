<?php

namespace Database\Seeders;

use App\Models\Warband;
use App\Models\Warrior;
use App\Models\WarriorTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WarriorTemplateSeeder extends Seeder
{
    public function run(): void
    {
        WarriorTemplate::insert([
            [
                'gold' => rand(10, 50),
                'warband_type' => Warband::TYPES[0],
                'type' => 'Magister',
                'is_hero' => true,
                'stat_movement' => 4,
                'stat_weapon_skill' => 4,
                'stat_ballistic_skill' => 4,
                'stat_strength' => 3,
                'stat_toughness' => 3,
                'stat_wounds' => 1,
                'stat_initiative' => 3,
                'stat_attacks' => 1,
                'stat_leadership' => 8,
                'starting_experience' => 20,
                'experience_available' => 90,
            ],
            [
                'gold' => rand(10, 50),
                'warband_type' => Warband::TYPES[0],
                'type' => 'Mutant',
                'is_hero' => false,
                'stat_movement' => 4,
                'stat_weapon_skill' => 3,
                'stat_ballistic_skill' => 3,
                'stat_strength' => 3,
                'stat_toughness' => 3,
                'stat_wounds' => 1,
                'stat_initiative' => 3,
                'stat_attacks' => 1,
                'stat_leadership' => 7,
                'starting_experience' => 0,
                'experience_available' => 14,
            ],
            [
                'gold' => rand(10, 50),
                'warband_type' => Warband::TYPES[0],
                'type' => 'Beastman',
                'is_hero' => false,
                'stat_movement' => 4,
                'stat_weapon_skill' => 4,
                'stat_ballistic_skill' => 3,
                'stat_strength' => 3,
                'stat_toughness' => 4,
                'stat_wounds' => 2,
                'stat_initiative' => 3,
                'stat_attacks' => 1,
                'stat_leadership' => 7,
                'starting_experience' => 0,
                'experience_available' => 14,
            ],
            [
                'gold' => rand(10, 50),
                'warband_type' => Warband::TYPES[1],
                'type' => 'Assassin',
                'is_hero' => true,
                'stat_movement' => 6,
                'stat_weapon_skill' => 4,
                'stat_ballistic_skill' => 4,
                'stat_strength' => 4,
                'stat_toughness' => 3,
                'stat_wounds' => 1,
                'stat_initiative' => 5,
                'stat_attacks' => 1,
                'stat_leadership' => 7,
                'starting_experience' => 20,
                'experience_available' => 90,
            ],
            [
                'gold' => rand(10, 50),
                'warband_type' => Warband::TYPES[1],
                'type' => 'Verminkin',
                'is_hero' => false,
                'stat_movement' => 5,
                'stat_weapon_skill' => 3,
                'stat_ballistic_skill' => 3,
                'stat_strength' => 3,
                'stat_toughness' => 3,
                'stat_wounds' => 1,
                'stat_initiative' => 4,
                'stat_attacks' => 1,
                'stat_leadership' => 5,
                'starting_experience' => 0,
                'experience_available' => 14,
            ],
            [
                'gold' => rand(10, 50),
                'warband_type' => Warband::TYPES[1],
                'type' => 'Rat Ogre',
                'is_hero' => false,
                'stat_movement' => 6,
                'stat_weapon_skill' => 3,
                'stat_ballistic_skill' => 3,
                'stat_strength' => 5,
                'stat_toughness' => 5,
                'stat_wounds' => 3,
                'stat_initiative' => 4,
                'stat_attacks' => 3,
                'stat_leadership' => 4,
                'starting_experience' => 0,
                'experience_available' => 14,
            ],
        ]);
    }
}
