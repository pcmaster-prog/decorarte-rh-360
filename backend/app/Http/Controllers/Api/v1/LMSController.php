<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LMSController extends Controller
{
    public function courses(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $courses = Course::with(['lessons'])->get();
        $enrollments = CourseEnrollment::where('employee_id', $employee->id)->get()->keyBy('course_id');

        $result = $courses->map(function ($course) use ($enrollments) {
            $enrollment = $enrollments->get($course->id);
            return [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'banner_image' => $course->banner_image,
                'category' => $course->category,
                'xp_reward' => $course->xp_reward,
                'lessons_count' => $course->lessons->count(),
                'enrollment' => $enrollment ? [
                    'status' => $enrollment->status,
                    'progress_percentage' => $enrollment->progress_percentage,
                    'score' => $enrollment->score,
                ] : null,
            ];
        });

        return response()->json($result);
    }

    public function enroll(Request $request, $id)
    {
        $employee = $request->user()->employee;
        $course = Course::findOrFail($id);

        $enrollment = CourseEnrollment::firstOrCreate([
            'employee_id' => $employee->id,
            'course_id' => $course->id,
        ], [
            'status' => 'in_progress',
            'progress_percentage' => 0,
        ]);

        return response()->json([
            'message' => 'Inscrito en el curso correctamente.',
            'enrollment' => $enrollment
        ]);
    }

    public function getCourseDetails(Request $request, $id)
    {
        $employee = $request->user()->employee;
        $course = Course::with('lessons')->findOrFail($id);
        
        $enrollment = CourseEnrollment::where('employee_id', $employee->id)
            ->where('course_id', $course->id)
            ->first();

        $completedLessonIds = [];
        if ($enrollment) {
            $completedLessonIds = LessonProgress::where('course_enrollment_id', $enrollment->id)
                ->pluck('lesson_id')
                ->toArray();
        }

        return response()->json([
            'course' => $course,
            'enrollment' => $enrollment,
            'completed_lessons' => $completedLessonIds
        ]);
    }

    public function completeLesson(Request $request, $courseId, $lessonId)
    {
        $employee = $request->user()->employee;
        $course = Course::with('lessons')->findOrFail($courseId);
        $lesson = Lesson::findOrFail($lessonId);

        $enrollment = CourseEnrollment::where('employee_id', $employee->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            $enrollment = CourseEnrollment::create([
                'employee_id' => $employee->id,
                'course_id' => $course->id,
                'status' => 'in_progress',
                'progress_percentage' => 0,
            ]);
        }

        LessonProgress::firstOrCreate([
            'course_enrollment_id' => $enrollment->id,
            'lesson_id' => $lesson->id,
        ]);

        // Calculate progress percentage
        $totalLessons = $course->lessons->count();
        $completedLessonsCount = LessonProgress::where('course_enrollment_id', $enrollment->id)->count();
        
        $progress = $totalLessons > 0 ? round(($completedLessonsCount / $totalLessons) * 100) : 100;
        $enrollment->update(['progress_percentage' => $progress]);

        return response()->json([
            'message' => 'Lección marcada como completada.',
            'progress_percentage' => $progress,
            'enrollment' => $enrollment
        ]);
    }

    public function submitQuiz(Request $request, $id)
    {
        $request->validate([
            'score' => 'required|integer|min:0|max:100',
        ]);

        $employee = $request->user()->employee;
        $course = Course::findOrFail($id);
        $score = $request->input('score');

        $enrollment = CourseEnrollment::where('employee_id', $employee->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'No estás inscrito en este curso.'], 422);
        }

        $passed = $score >= 80;
        $status = $passed ? 'completed' : 'in_progress';

        $enrollment->update([
            'status' => $status,
            'score' => $score,
            'progress_percentage' => 100, // Completing quiz sets progress to 100%
            'completed_at' => $passed ? now() : null,
        ]);

        $xpEarned = 0;
        $certificate = null;

        if ($passed) {
            $xpEarned = $course->xp_reward;
            $employee->increment('xp', $xpEarned);

            // Generate Certificate
            $certificateCode = 'CERT-' . strtoupper(Str::random(10));
            $certificate = Certificate::create([
                'course_enrollment_id' => $enrollment->id,
                'code' => $certificateCode,
                'file_path' => 'certificates/' . $certificateCode . '.pdf',
                'issued_at' => now(),
            ]);
        }

        return response()->json([
            'message' => $passed ? '¡Felicidades! Aprobaste el examen.' : 'Examen no aprobado. Inténtalo de nuevo.',
            'passed' => $passed,
            'score' => $score,
            'xp_earned' => $xpEarned,
            'certificate' => $certificate,
            'enrollment' => $enrollment
        ]);
    }
}
