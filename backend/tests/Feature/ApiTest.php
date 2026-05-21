<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Employee;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Position;
use App\Models\JobVacancy;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_auth_login_validation()
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_auth_google_login_stub()
    {
        // Seed a demo user since google login stub will find or create/return a token for demo user or create a new user
        $response = $this->postJson('/api/v1/auth/google', [
            'email' => 'admin.irapuato@decorarte.com',
            'name' => 'Admin Test',
            'token' => 'dummy-google-token'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'user']);
    }

    public function test_public_vacancies_endpoint()
    {
        // Create dummy data
        $company = Company::create(['name' => 'DecorArte Test']);
        $branch = Branch::create(['company_id' => $company->id, 'name' => 'Irapuato']);
        $position = Position::create([
            'company_id' => $company->id,
            'name' => 'Cajero Test',
            'department' => 'Cajas',
            'nivel' => 'Operativo',
            'sueldo' => 8000,
            'prestaciones' => [],
            'horario' => '08:00 - 16:30',
            'vacaciones' => 12,
            'permisos' => [],
            'supervisor' => 'Supervisor',
            'kpis' => [],
            'cursos' => [],
            'checklist_onboarding' => [],
            'tareas_frecuentes' => []
        ]);

        $vacancy = JobVacancy::create([
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'position_id' => $position->id,
            'title' => 'Cajero Vacancy',
            'description' => 'Test job',
            'status' => 'open'
        ]);

        $response = $this->getJson('/api/v1/vacancies');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_public_apply_endpoint()
    {
        // Create dummy vacancy
        $company = Company::create(['name' => 'DecorArte Test']);
        $branch = Branch::create(['company_id' => $company->id, 'name' => 'Irapuato']);
        $position = Position::create([
            'company_id' => $company->id,
            'name' => 'Cajero Test',
            'department' => 'Cajas',
            'nivel' => 'Operativo',
            'sueldo' => 8000,
            'prestaciones' => [],
            'horario' => '08:00 - 16:30',
            'vacaciones' => 12,
            'permisos' => [],
            'supervisor' => 'Supervisor',
            'kpis' => [],
            'cursos' => [],
            'checklist_onboarding' => [],
            'tareas_frecuentes' => []
        ]);

        $vacancy = JobVacancy::create([
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'position_id' => $position->id,
            'title' => 'Cajero Vacancy',
            'description' => 'Test job',
            'status' => 'open'
        ]);

        $response = $this->postJson('/api/v1/apply', [
            'job_vacancy_id' => $vacancy->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@gmail.com',
            'phone' => '1234567890',
            'curp' => 'ABC123456HDFRRN04',
            'rfc' => 'ABC123456XYZ',
            'nss' => '12345678901'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'application']);
    }

    public function test_labor_settings_endpoints()
    {
        $company = Company::create(['name' => 'DecorArte Test']);
        $branch = Branch::create(['company_id' => $company->id, 'name' => 'Irapuato']);
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@decorarte.com',
            'password' => bcrypt('password')
        ]);
        $employee = Employee::create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@decorarte.com',
            'code' => 'EMP-TEST-01',
            'status' => 'active'
        ]);

        // 1. GET Settings (which should auto-create default settings if they don't exist)
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/labor-settings');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'toleranciaMinutos',
                     'horaEntrada',
                     'horaSalida',
                     'retardosParaSancion',
                     'descuentoDiasPorSancion',
                     'leySillaActiva',
                     'reduccionJornada'
                 ]);

        // 2. PUT Settings (updating rules)
        $response = $this->actingAs($user, 'sanctum')->putJson('/api/v1/labor-settings', [
            'toleranciaMinutos' => 15,
            'horaEntrada' => '09:00',
            'retardosParaSancion' => 4,
            'descuentoDiasPorSancion' => 2
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'toleranciaMinutos' => 15,
                     'horaEntrada' => '09:00',
                     'retardosParaSancion' => 4,
                     'descuentoDiasPorSancion' => 2
                 ]);
    }
}
