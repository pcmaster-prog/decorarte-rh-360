<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskEvidence extends Model
{
    protected $table = 'task_evidences';

    protected $fillable = [
        'task_assignment_id',
        'task_tool_template_id',
        'value',
        'file_path',
    ];

    public function assignment()
    {
        return $this->belongsTo(TaskAssignment::class, 'task_assignment_id');
    }
}
