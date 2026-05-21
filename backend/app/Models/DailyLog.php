<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyLog extends Model
{
    protected $fillable = ['routine_assignment_id', 'routine_task_id', 'checked', 'notes'];

    public function assignment()
    {
        return $this->belongsTo(RoutineAssignment::class, 'routine_assignment_id');
    }

    public function task()
    {
        return $this->belongsTo(RoutineTask::class, 'routine_task_id');
    }
}
