<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Course;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LaborSetting;
use App\Models\Lesson;
use App\Models\Position;
use App\Models\Role;
use App\Models\User;
use App\Models\WorkArea;
use App\Models\WorkSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DecorArteDemoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Company
        $company = Company::create([
            'name' => 'DecorArte',
            'rfc' => 'DEC091012AB3',
            'address' => 'Av. Solidaridad 1024, Irapuato, Gto.',
        ]);

        // 2. Create Branch
        $branch = Branch::create([
            'company_id' => $company->id,
            'name' => 'Irapuato Centro',
            'code' => 'IRA-01',
            'address' => 'Guerrero 45, Zona Centro, Irapuato, Gto.',
        ]);

        // 3. Create Departments
        $depts = [
            'RH' => 'Recursos Humanos',
            'ADM' => 'Administración',
            'VTA' => 'Ventas',
            'CAJ' => 'Cajas',
            'PSG' => 'Pesaje',
            'ALM' => 'Almacén',
            'PRO' => 'Producción',
            'LMP' => 'Limpieza',
        ];

        $departments = [];
        foreach ($depts as $code => $name) {
            $departments[$code] = Department::create([
                'company_id' => $company->id,
                'name' => $name,
                'code' => $code,
            ]);
        }

        // 4. Create Positions
        $positionsData = [
            'RH' => [
                ['name' => 'Gerente de RH', 'code' => 'GER-RH', 'salary' => 850.00],
            ],
            'ADM' => [
                ['name' => 'Administrador de Sucursal', 'code' => 'ADM-SUC', 'salary' => 750.00],
            ],
            'VTA' => [
                ['name' => 'Asesor de ventas', 'code' => 'ASE-VTA', 'salary' => 300.00],
            ],
            'CAJ' => [
                ['name' => 'Cajero', 'code' => 'CAJ-OPE', 'salary' => 320.00],
                ['name' => 'Supervisor de cajas', 'code' => 'SUP-CAJ', 'salary' => 450.00],
            ],
            'PSG' => [
                ['name' => 'Operario de pesaje', 'code' => 'OPE-PSG', 'salary' => 280.00],
            ],
            'ALM' => [
                ['name' => 'Almacenista', 'code' => 'ALM-OPE', 'salary' => 290.00],
            ],
            'PRO' => [
                ['name' => 'Supervisor de producción', 'code' => 'SUP-PRO', 'salary' => 480.00],
                ['name' => 'Ayudante integral', 'code' => 'AYU-INT', 'salary' => 260.00],
            ],
            'LMP' => [
                ['name' => 'Auxiliar de Limpieza', 'code' => 'AUX-LMP', 'salary' => 240.00],
            ],
        ];

        $positions = [];
        foreach ($positionsData as $deptCode => $posList) {
            $dept = $departments[$deptCode];
            foreach ($posList as $posInfo) {
                $positions[$posInfo['code']] = Position::create([
                    'department_id' => $dept->id,
                    'name' => $posInfo['name'],
                    'code' => $posInfo['code'],
                    'salary_base' => $posInfo['salary'],
                ]);
            }
        }

        // 5. Create Work Areas and Sections
        $areas = [
            'Cajas' => ['Caja 1', 'Caja 2', 'Caja Rápida'],
            'Mostrador' => ['Mostrador Principal', 'Dulcería'],
            'Pasillos' => ['Pasillo Chocolates', 'Pasillo Materia Prima', 'Pasillo Desechables'],
            'Pesaje' => ['Báscula 1', 'Báscula 2'],
            'Bodega' => ['Bodega Seca', 'Cámara Fría'],
            'Limpieza' => ['Patio', 'Baños', 'Entrada Principal'],
        ];

        foreach ($areas as $areaName => $sections) {
            $workArea = WorkArea::create([
                'company_id' => $company->id,
                'branch_id' => $branch->id,
                'name' => $areaName,
            ]);

            foreach ($sections as $sectionName) {
                WorkSection::create([
                    'work_area_id' => $workArea->id,
                    'name' => $sectionName,
                ]);
            }
        }

        // 6. Labor Settings
        LaborSetting::create([
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'late_tolerance_minutes' => 10,
            'entry_time' => '08:30:00',
            'exit_time' => '17:00:00',
            'chair_law_enabled' => true,
            'late_count_before_penalty' => 3,
            'penalty_wage_days' => 1,
            'weekly_hours_by_year' => [
                2026 => 48,
                2027 => 46,
                2028 => 44,
                2029 => 42,
                2030 => 40
            ],
        ]);

        // 7. Roles Lookup
        $roleAdmin = Role::where('slug', 'admin')->first();
        $roleSupervisor = Role::where('slug', 'supervisor')->first();
        $roleColaborador = Role::where('slug', 'colaborador')->first();

        // 8. Create Demo Users & Employees
        // Admin user (Sofía)
        $userAdmin = User::create([
            'role_id' => $roleAdmin->id,
            'name' => 'Sofía Rodríguez',
            'email' => 'sofia@decorarte.com',
            'password' => Hash::make('decorarte2026'),
        ]);

        Employee::create([
            'user_id' => $userAdmin->id,
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'department_id' => $departments['RH']->id,
            'position_id' => $positions['GER-RH']->id,
            'code' => 'EMP-001',
            'first_name' => 'Sofía',
            'last_name' => 'Rodríguez',
            'email' => 'sofia@decorarte.com',
            'phone' => '4621234567',
            'curp' => 'RODS880101MDFRXX01',
            'rfc' => 'RODS880101AA1',
            'nss' => '12345678901',
            'status' => 'active',
            'admission_date' => '2023-01-15',
            'xp' => 1200,
        ]);

        // Supervisor user (Alejandro)
        $userSup = User::create([
            'role_id' => $roleSupervisor->id,
            'name' => 'Alejandro Reyes',
            'email' => 'alejandro@decorarte.com',
            'password' => Hash::make('supervisor360'),
        ]);

        Employee::create([
            'user_id' => $userSup->id,
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'department_id' => $departments['ADM']->id,
            'position_id' => $positions['ADM-SUC']->id,
            'code' => 'EMP-002',
            'first_name' => 'Alejandro',
            'last_name' => 'Reyes',
            'email' => 'alejandro@decorarte.com',
            'phone' => '4629876543',
            'curp' => 'REYA850202HDFRXX02',
            'rfc' => 'REYA850202BB2',
            'nss' => '23456789012',
            'status' => 'active',
            'admission_date' => '2024-03-01',
            'xp' => 850,
        ]);

        // Colaborador user (Juan - Cajero)
        $userJuan = User::create([
            'role_id' => $roleColaborador->id,
            'name' => 'Juan Pérez',
            'email' => 'juan@decorarte.com',
            'password' => Hash::make('colaborador360'),
        ]);

        Employee::create([
            'user_id' => $userJuan->id,
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'department_id' => $departments['CAJ']->id,
            'position_id' => $positions['CAJ-OPE']->id,
            'code' => 'EMP-003',
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan@decorarte.com',
            'phone' => '4625556677',
            'curp' => 'PERJ950505MDFRXX03',
            'rfc' => 'PERJ950505CC3',
            'nss' => '34567890123',
            'status' => 'active',
            'admission_date' => '2025-06-10',
            'xp' => 450,
        ]);

        // Colaborador user (María - Pesaje)
        $userMaria = User::create([
            'role_id' => $roleColaborador->id,
            'name' => 'María López',
            'email' => 'maria@decorarte.com',
            'password' => Hash::make('colaborador360'),
        ]);

        Employee::create([
            'user_id' => $userMaria->id,
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'department_id' => $departments['PSG']->id,
            'position_id' => $positions['OPE-PSG']->id,
            'code' => 'EMP-004',
            'first_name' => 'María',
            'last_name' => 'López',
            'email' => 'maria@decorarte.com',
            'phone' => '4627778899',
            'curp' => 'LOPM980808MDFRXX04',
            'rfc' => 'LOPM980808DD4',
            'nss' => '45678901234',
            'status' => 'active',
            'admission_date' => '2025-09-01',
            'xp' => 320,
        ]);

        // 9. LMS Courses and Lessons
        $course1 = Course::create([
            'company_id' => $company->id,
            'title' => 'Inducción General DecorArte',
            'description' => 'Aprende los valores, políticas básicas y la cultura laboral de nuestra gran familia.',
            'banner_image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
            'category' => 'Inducción',
            'xp_reward' => 100,
        ]);

        Lesson::create([
            'course_id' => $course1->id,
            'title' => 'Bienvenida a DecorArte',
            'description' => 'Mensaje de nuestra fundadora y los valores que nos definen.',
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'duration_minutes' => 5,
            'sort_order' => 1,
        ]);

        Lesson::create([
            'course_id' => $course1->id,
            'title' => 'Políticas y Reglas del Colaborador',
            'description' => 'Información clave sobre tu horario, uniforme, asistencia y código de vestimenta.',
            'video_url' => 'https://www.w3schools.com/html/movie.mp4',
            'duration_minutes' => 8,
            'sort_order' => 2,
        ]);

        $course2 = Course::create([
            'company_id' => $company->id,
            'title' => 'Operación de Caja Registradora',
            'description' => 'Aprende el uso del sistema de punto de venta, cobro con tarjeta y arqueo de caja.',
            'banner_image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
            'category' => 'Cajas',
            'xp_reward' => 150,
        ]);

        Lesson::create([
            'course_id' => $course2->id,
            'title' => 'Inicio de Turno y Arqueo de Caja',
            'description' => 'Cómo realizar el conteo inicial de efectivo y validar los terminales bancarios.',
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'duration_minutes' => 12,
            'sort_order' => 1,
        ]);
    }
}
