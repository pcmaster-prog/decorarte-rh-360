<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicantDocument extends Model
{
    protected $fillable = [
        'applicant_id',
        'document_type',
        'file_path',
        'status',
    ];

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }
}
