<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['company_id', 'title', 'description', 'banner_image', 'category', 'xp_reward'];

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }
}
