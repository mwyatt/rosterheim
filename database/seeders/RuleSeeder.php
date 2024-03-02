<?php

namespace Database\Seeders;

use App\Models\Rule;
use App\Models\Warband;
use App\Models\Warrior;
use App\Models\WarriorTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RuleSeeder extends Seeder
{
    public function run(): void
    {
        Rule::insert([
            [
                'name' => 'Parry',
                'description' => 'After receiving a hit the model armed with a sword may roll a D6. If the score is greater than the hit roll, the model has parried the blow, and that attack is discarded. A model may not parry attacks made with double or more its own strength',
            ],
            [
                'name' => 'Leader',
                'description' => 'Any models in the warband within 6" of the leader may use his leadership instead of their own.',
            ],
            [
                'name' => 'Wizard',
                'description' => 'You are a wizard! See the magic section for details.',
            ],
        ]);
    }
}
