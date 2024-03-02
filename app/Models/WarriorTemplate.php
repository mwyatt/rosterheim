<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarriorTemplate extends Model
{
    use HasFactory;

    public function rules(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            Rule::class,
            WarriorRule::class,
            'warrior_template_id',
            'id',
            'id',
            'rule_id'
        );
    }
}
