<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Job Vacancies
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('position_id')->constrained('positions')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->string('status')->default('open'); // open, paused, closed
            $table->string('type')->default('full-time'); // full-time, part-time
            $table->timestamps();
        });

        // 2. Applicants
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('curp')->nullable();
            $table->string('rfc')->nullable();
            $table->string('nss')->nullable();
            $table->timestamps();
        });

        // 3. Job Applications
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_vacancy_id')->constrained('job_vacancies')->onDelete('cascade');
            $table->foreignId('applicant_id')->constrained('applicants')->onDelete('cascade');
            $table->string('status')->default('applied'); // applied, reviewing, exam_taken, interview_scheduled, offer_made, hired, rejected
            $table->integer('score')->nullable(); // screening exam score
            $table->json('answers')->nullable(); // answers to screening quiz
            $table->timestamps();
        });

        // 4. Applicant Documents
        Schema::create('applicant_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained('applicants')->onDelete('cascade');
            $table->string('document_type'); // curp, rfc, nss, cv, address_proof
            $table->string('file_path');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
        });

        // 5. Evaluation Templates
        Schema::create('evaluation_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 6. Evaluation Questions
        Schema::create('evaluation_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_template_id')->constrained('evaluation_templates')->onDelete('cascade');
            $table->text('question_text');
            $table->string('question_type')->default('multiple_choice'); // multiple_choice, open
            $table->json('options')->nullable(); // answers choices for multiple choice
            $table->integer('score')->default(0);
            $table->timestamps();
        });

        // 7. Evaluations
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained('job_applications')->onDelete('cascade');
            $table->foreignId('evaluation_template_id')->constrained('evaluation_templates')->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->text('comments')->nullable();
            $table->timestamps();
        });

        // 8. Interviews
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained('job_applications')->onDelete('cascade');
            $table->foreignId('interviewer_employee_id')->constrained('employees')->onDelete('cascade');
            $table->dateTime('scheduled_date');
            $table->string('status')->default('scheduled'); // scheduled, completed, cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 9. Employment Offers
        Schema::create('employment_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained('job_applications')->onDelete('cascade');
            $table->decimal('proposed_salary', 10, 2);
            $table->date('start_date');
            $table->string('status')->default('pending'); // pending, accepted, declined
            $table->text('terms')->nullable();
            $table->timestamps();
        });

        // 10. Contracts
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('contract_type'); // determined, undetermined, project
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('salary', 10, 2);
            $table->string('file_path')->nullable();
            $table->string('status')->default('draft'); // draft, active, terminated
            $table->timestamps();
        });

        // 11. Employee Files (expediente digital)
        Schema::create('employee_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('document_type'); // curp, rfc, nss, contract, cert_estudio, address_proof
            $table->string('file_path');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_files');
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('employment_offers');
        Schema::dropIfExists('interviews');
        Schema::dropIfExists('evaluations');
        Schema::dropIfExists('evaluation_questions');
        Schema::dropIfExists('evaluation_templates');
        Schema::dropIfExists('applicant_documents');
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('job_vacancies');
    }
};
