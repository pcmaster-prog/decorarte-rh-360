<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = ['name', 'rfc', 'address'];

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function laborSettings()
    {
        return $this->hasOne(LaborSetting::class);
    }
}
