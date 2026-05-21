<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'company_id',
        'branch_id',
        'department_id',
        'position_id',
        'code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'curp',
        'rfc',
        'nss',
        'status',
        'admission_date',
        'xp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function taskAssignments()
    {
        return $this->hasMany(TaskAssignment::class);
    }

    public function routineAssignments()
    {
        return $this->hasMany(RoutineAssignment::class);
    }

    public function courseEnrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
