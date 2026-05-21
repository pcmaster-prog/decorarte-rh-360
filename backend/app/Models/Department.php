<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['company_id', 'name', 'code'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
