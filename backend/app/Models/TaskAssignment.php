<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskAssignment extends Model
{
    protected $fillable = [
        'employee_id',
        'task_template_id',
        'work_area_id',
        'work_section_id',
        'status',
        'assigned_date',
        'due_time',
        'completed_at',
        'score',
        'reviewer_employee_id',
    ];

    protected $casts = [
        'assigned_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function template()
    {
        return $this->belongsTo(TaskTemplate::class, 'task_template_id');
    }

    public function evidences()
    {
        return $this->hasMany(TaskEvidence::class);
    }
}
