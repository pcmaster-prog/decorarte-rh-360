<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseEnrollment extends Model
{
    protected $fillable = [
        'employee_id',
        'course_id',
        'status',
        'progress_percentage',
        'enrolled_at',
        'completed_at',
        'score',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
