<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\CourseEnrollment;
use App\Models\Employee;
use App\Models\TaskAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            return response()->json([
                'message' => 'El usuario autenticado no tiene un perfil de colaborador asignado.'
            ], 404);
        }

        $branchId = $employee->branch_id;
        $workDate = now()->toDateString();

        // 1. Attendance Widget (Today's statistics in branch)
        $todayAttendance = AttendanceRecord::whereHas('employee', function ($q) use ($branchId) {
            $q->where('branch_id', $branchId);
        })->where('work_date', $workDate)->get();

        $presentCount = $todayAttendance->where('status', 'present')->count();
        $lateCount = $todayAttendance->where('status', 'late')->count();
        $absentCount = Employee::where('branch_id', $branchId)->where('status', 'active')->count() - $todayAttendance->count();
        $absentCount = max(0, $absentCount);

        // 2. Personal Task Widget
        $myTasks = TaskAssignment::where('employee_id', $employee->id)
            ->where('assigned_date', $workDate)
            ->get();

        $myCompletedTasks = $myTasks->where('status', 'completed')->count();
        $myTotalTasks = $myTasks->count();

        // 3. LMS Widget
        $myCoursesCount = CourseEnrollment::where('employee_id', $employee->id)->count();
        $myCompletedCoursesCount = CourseEnrollment::where('employee_id', $employee->id)->where('status', 'completed')->count();

        // 4. Leaderboard Ranking (Top XP in branch)
        $leaderboard = Employee::where('branch_id', $branchId)
            ->where('status', 'active')
            ->select('id', 'first_name', 'last_name', 'xp')
            ->orderBy('xp', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'attendance' => [
                'present' => $presentCount,
                'late' => $lateCount,
                'absent' => $absentCount,
            ],
            'personal_tasks' => [
                'completed' => $myCompletedTasks,
                'total' => $myTotalTasks,
                'progress_percentage' => $myTotalTasks > 0 ? round(($myCompletedTasks / $myTotalTasks) * 100) : 0
            ],
            'academy' => [
                'enrolled' => $myCoursesCount,
                'completed' => $myCompletedCoursesCount,
            ],
            'leaderboard' => $leaderboard->map(function ($emp, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => "{$emp->first_name} {$emp->last_name}",
                    'xp' => $emp->xp
                ];
            }),
            'active_shifts' => [
                'chair_law_active' => true // Read dynamically from settings if needed
            ]
        ]);
    }
}
