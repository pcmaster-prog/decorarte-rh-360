<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Routine extends Model
{
    protected $fillable = ['company_id', 'title', 'description', 'type'];

    public function tasks()
    {
        return $this->hasMany(RoutineTask::class)->orderBy('sort_order');
    }
}
