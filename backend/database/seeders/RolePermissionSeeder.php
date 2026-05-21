<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Define permissions
        $permissionsList = [
            ['name' => 'View Dashboard', 'slug' => 'view_dashboard', 'description' => 'Permite ver los widgets del dashboard.'],
            ['name' => 'Log Attendance', 'slug' => 'log_attendance', 'description' => 'Permite registrar entradas y salidas.'],
            ['name' => 'Complete Tasks', 'slug' => 'complete_tasks', 'description' => 'Permite realizar y marcar tareas diarias.'],
            ['name' => 'Complete LMS Courses', 'slug' => 'complete_courses', 'description' => 'Permite realizar cursos de capacitación.'],
            
            ['name' => 'Manage Employees', 'slug' => 'manage_employees', 'description' => 'Permite crear y editar expedientes de colaboradores.'],
            ['name' => 'Manage Vacancies', 'slug' => 'manage_vacancies', 'description' => 'Permite publicar vacantes y revisar aspirantes.'],
            ['name' => 'Manage Attendance', 'slug' => 'manage_attendance', 'description' => 'Permite modificar registros de asistencia y aprobar justificaciones.'],
            ['name' => 'Manage Tasks', 'slug' => 'manage_tasks', 'description' => 'Permite asignar tareas a colaboradores.'],
            ['name' => 'Manage LMS', 'slug' => 'manage_lms', 'description' => 'Permite crear cursos, lecciones y exámenes.'],
            ['name' => 'Process Payroll', 'slug' => 'process_payroll', 'description' => 'Permite ver y procesar nómina.'],
        ];

        $permissions = [];
        foreach ($permissionsList as $perm) {
            $permissions[$perm['slug']] = Permission::create($perm);
        }

        // 2. Define Roles
        $admin = Role::create([
            'name' => 'Administrador',
            'slug' => 'admin',
            'description' => 'Super usuario con acceso completo a todo el sistema.'
        ]);

        $supervisor = Role::create([
            'name' => 'Supervisor',
            'slug' => 'supervisor',
            'description' => 'Gestor operativo de sucursal.'
        ]);

        $colaborador = Role::create([
            'name' => 'Colaborador',
            'slug' => 'colaborador',
            'description' => 'Personal operativo en sucursal.'
        ]);

        // 3. Map permissions to roles
        // Admin gets all permissions dynamically through Gate::before, but let's sync anyway
        $admin->permissions()->sync(array_values(array_map(fn($p) => $p->id, $permissions)));

        // Supervisor permissions
        $supervisor->permissions()->sync([
            $permissions['view_dashboard']->id,
            $permissions['log_attendance']->id,
            $permissions['complete_tasks']->id,
            $permissions['complete_courses']->id,
            $permissions['manage_attendance']->id,
            $permissions['manage_tasks']->id,
        ]);

        // Colaborador permissions
        $colaborador->permissions()->sync([
            $permissions['view_dashboard']->id,
            $permissions['log_attendance']->id,
            $permissions['complete_tasks']->id,
            $permissions['complete_courses']->id,
        ]);
    }
}
