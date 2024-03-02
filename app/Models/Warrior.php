<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warrior extends Model
{
    use HasFactory;

    protected $fillable = [
        'warband_id',
        'warrior_template_id',
        'name',
        'qty',
    ];

    public function equipments()
    {
        return $this->belongsToMany(Equipment::class, 'warrior_equipments');
    }
}
