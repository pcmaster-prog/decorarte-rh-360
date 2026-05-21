<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoutineTask extends Model
{
    protected $fillable = ['routine_id', 'title', 'description', 'sort_order'];

    public function routine()
    {
        return $this->belongsTo(Routine::class);
    }
}
