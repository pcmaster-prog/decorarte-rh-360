<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoutineAssignment extends Model
{
    protected $fillable = ['employee_id', 'routine_id', 'work_date', 'status', 'completed_at'];

    protected $casts = [
        'work_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function routine()
    {
        return $this->belongsTo(Routine::class);
    }

    public function logs()
    {
        return $this->hasMany(DailyLog::class);
    }
}
