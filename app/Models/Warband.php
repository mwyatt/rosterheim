<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warband extends Model
{
    use HasFactory;

    const TYPES = [
        'Cult of the possessed',
        'Skaven',
    ];

    protected $fillable = [
        'id',
        'name',
        'type',
    ];

    public function warriors()
    {
        return $this->hasMany(Warrior::class);
    }
}
