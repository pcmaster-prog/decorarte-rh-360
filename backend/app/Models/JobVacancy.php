<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    protected $fillable = [
        'company_id',
        'branch_id',
        'position_id',
        'title',
        'description',
        'requirements',
        'benefits',
        'status',
        'type',
    ];

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
