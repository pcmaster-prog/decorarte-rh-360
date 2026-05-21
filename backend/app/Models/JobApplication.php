<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'job_vacancy_id',
        'applicant_id',
        'status',
        'score',
        'answers',
    ];

    protected $casts = [
        'answers' => 'json',
    ];

    public function vacancy()
    {
        return $this->belongsTo(JobVacancy::class, 'job_vacancy_id');
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }
}
