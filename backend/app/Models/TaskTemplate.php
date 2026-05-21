<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskTemplate extends Model
{
    protected $fillable = ['company_id', 'title', 'description', 'estimated_minutes', 'xp_reward'];

    public function assignments()
    {
        return $this->hasMany(TaskAssignment::class);
    }
}
