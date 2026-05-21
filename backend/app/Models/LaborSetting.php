<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaborSetting extends Model
{
    protected $fillable = [
        'company_id',
        'branch_id',
        'late_tolerance_minutes',
        'entry_time',
        'exit_time',
        'chair_law_enabled',
        'late_count_before_penalty',
        'penalty_wage_days',
        'weekly_hours_by_year',
    ];

    protected $casts = [
        'chair_law_enabled' => 'boolean',
        'weekly_hours_by_year' => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
