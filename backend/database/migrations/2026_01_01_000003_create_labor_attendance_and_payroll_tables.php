<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Labor Settings (chair law, late tolerance, etc)
        Schema::create('labor_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->integer('late_tolerance_minutes')->default(10);
            $table->time('entry_time')->default('08:30:00');
            $table->time('exit_time')->default('18:00:00');
            $table->boolean('chair_law_enabled')->default(true);
            $table->integer('late_count_before_penalty')->default(3);
            $table->integer('penalty_wage_days')->default(1);
            $table->json('weekly_hours_by_year')->nullable();
            $table->timestamps();
        });

        // 2. Schedules
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->integer('day_of_week'); // 0 = Sunday, 1 = Monday, etc.
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        // 3. Benefits Profiles
        Schema::create('benefits_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->integer('vacation_days_annual')->default(12);
            $table->decimal('bonus_percentage', 5, 2)->default(15.00); // aguinaldo
            $table->boolean('has_food_coupons')->default(false);
            $table->timestamps();
        });

        // 4. Attendance Records
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('work_date');
            $table->dateTime('check_in')->nullable();
            $table->dateTime('check_out')->nullable();
            $table->string('status')->default('absent'); // present, late, absent, justified, leave
            $table->timestamps();
        });

        // 5. Attendance Adjustments (requests to edit timestamps)
        Schema::create('attendance_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_record_id')->constrained('attendance_records')->onDelete('cascade');
            $table->foreignId('requester_employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('approver_employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->dateTime('requested_check_in')->nullable();
            $table->dateTime('requested_check_out')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        // 6. Payroll Periods
        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('payment_date')->nullable();
            $table->string('status')->default('draft'); // draft, processed, paid
            $table->timestamps();
        });

        // 7. Payroll Items
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->decimal('base_salary', 10, 2);
            $table->decimal('bonuses', 10, 2)->default(0.00);
            $table->decimal('deductions', 10, 2)->default(0.00);
            $table->decimal('total_net', 10, 2);
            $table->timestamps();
        });

        // 8. Payroll Receipts
        Schema::create('payroll_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_item_id')->constrained('payroll_items')->onDelete('cascade');
            $table->string('xml_path')->nullable();
            $table->string('pdf_path')->nullable();
            $table->dateTime('signed_at')->nullable();
            $table->timestamps();
        });

        // 9. Leave Requests
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('leave_type'); // vacation, sickness, maternity, personal
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('reason')->nullable();
            $table->foreignId('approver_employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->timestamps();
        });

        // 10. Vacation Balances
        Schema::create('vacation_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->integer('year');
            $table->integer('total_allocated')->default(12);
            $table->integer('total_used')->default(0);
            $table->timestamps();
        });

        // 11. Recognitions (Estrella DecorArte, etc)
        Schema::create('recognitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('giver_employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('receiver_employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category')->nullable();
            $table->timestamps();
        });

        // 12. Incidents
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('reporter_employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('incident_date');
            $table->string('type'); // delay, fault, performance, theft, dispute, other
            $table->text('description');
            $table->string('status')->default('reported'); // reported, under_review, resolved
            $table->timestamps();
        });

        // 13. Disciplinary Actions
        Schema::create('disciplinary_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->constrained('incidents')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('action_type'); // warning, suspension, termination
            $table->text('description');
            $table->date('penalty_start_date')->nullable();
            $table->date('penalty_end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disciplinary_actions');
        Schema::dropIfExists('incidents');
        Schema::dropIfExists('recognitions');
        Schema::dropIfExists('vacation_balances');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('payroll_receipts');
        Schema::dropIfExists('payroll_items');
        Schema::dropIfExists('payroll_periods');
        Schema::dropIfExists('attendance_adjustments');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('benefits_profiles');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('labor_settings');
    }
};
