<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'video_url', 'duration_minutes', 'sort_order'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
