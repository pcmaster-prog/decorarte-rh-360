<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['company_id', 'name', 'code', 'address'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
