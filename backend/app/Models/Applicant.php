<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'curp',
        'rfc',
        'nss',
    ];

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function documents()
    {
        return $this->hasMany(ApplicantDocument::class);
    }
}
