<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Work Areas
        Schema::create('work_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('name'); // Bodega, Caja, Mostrador, Pasillos, etc
            $table->timestamps();
        });

        // 2. Work Sections
        Schema::create('work_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_area_id')->constrained('work_areas')->onDelete('cascade');
            $table->string('name'); // e.g. "Pasillo Chocolates"
            $table->timestamps();
        });

        // 3. Task Templates
        Schema::create('task_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('estimated_minutes')->default(15);
            $table->integer('xp_reward')->default(10);
            $table->timestamps();
        });

        // 4. Task Tool Templates (e.g. scales, cash drawers with required output values)
        Schema::create('task_tool_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_template_id')->constrained('task_templates')->onDelete('cascade');
            $table->string('tool_name');
            $table->string('verification_type')->default('text'); // text, number, boolean, photo
            $table->timestamps();
        });

        // 5. Task Assignments
        Schema::create('task_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('task_template_id')->constrained('task_templates')->onDelete('cascade');
            $table->foreignId('work_area_id')->nullable()->constrained('work_areas')->onDelete('set null');
            $table->foreignId('work_section_id')->nullable()->constrained('work_sections')->onDelete('set null');
            $table->string('status')->default('pending'); // pending, in_progress, completed, failed
            $table->date('assigned_date');
            $table->time('due_time')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->integer('score')->nullable(); // performance score 1-100
            $table->foreignId('reviewer_employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->timestamps();
        });

        // 6. Task Evidences
        Schema::create('task_evidences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_assignment_id')->constrained('task_assignments')->onDelete('cascade');
            $table->foreignId('task_tool_template_id')->nullable()->constrained('task_tool_templates')->onDelete('set null');
            $table->text('value')->nullable(); // user entered output (e.g. weights, counts)
            $table->string('file_path')->nullable(); // photo path
            $table->timestamps();
        });

        // 7. Task Comments
        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_assignment_id')->constrained('task_assignments')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->text('comment');
            $table->timestamps();
        });

        // 8. Routines (Bitácoras - morning/night)
        Schema::create('routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('morning'); // morning, night
            $table->timestamps();
        });

        // 9. Routine Tasks
        Schema::create('routine_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_id')->constrained('routines')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 10. Routine Assignments
        Schema::create('routine_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('routine_id')->constrained('routines')->onDelete('cascade');
            $table->date('work_date');
            $table->string('status')->default('pending'); // pending, completed
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });

        // 11. Daily Logs (Bitácora checklist)
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_assignment_id')->constrained('routine_assignments')->onDelete('cascade');
            $table->foreignId('routine_task_id')->constrained('routine_tasks')->onDelete('cascade');
            $table->boolean('checked')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 12. Courses (LMS Academy)
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('category')->nullable(); // Ventas, Produccion, Induccion, etc.
            $table->integer('xp_reward')->default(50);
            $table->timestamps();
        });

        // 13. Lessons
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('duration_minutes')->default(10);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 14. Course Enrollments
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('status')->default('enrolled'); // enrolled, in_progress, completed
            $table->integer('progress_percentage')->default(0);
            $table->dateTime('enrolled_at')->useCurrent();
            $table->dateTime('completed_at')->nullable();
            $table->integer('score')->nullable(); // average score of exams
            $table->timestamps();
        });

        // 15. Lesson Progress
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_enrollment_id')->constrained('course_enrollments')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->dateTime('completed_at')->useCurrent();
            $table->timestamps();
        });

        // 16. Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_enrollment_id')->constrained('course_enrollments')->onDelete('cascade');
            $table->string('code')->unique();
            $table->string('file_path')->nullable();
            $table->dateTime('issued_at')->useCurrent();
            $table->timestamps();
        });

        // 17. Badges
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('xp_required')->default(100);
            $table->timestamps();
        });

        // 18. Employee Badges Pivot
        Schema::create('employee_badges', function (Blueprint $table) {
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('badge_id')->constrained('badges')->onDelete('cascade');
            $table->dateTime('unlocked_at')->useCurrent();
            $table->primary(['employee_id', 'badge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_badges');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('daily_logs');
        Schema::dropIfExists('routine_assignments');
        Schema::dropIfExists('routine_tasks');
        Schema::dropIfExists('routines');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('task_evidences');
        Schema::dropIfExists('task_assignments');
        Schema::dropIfExists('task_tool_templates');
        Schema::dropIfExists('task_templates');
        Schema::dropIfExists('work_sections');
        Schema::dropIfExists('work_areas');
    }
};
