<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\LaborSetting;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function status(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $workDate = now()->toDateString();
        $record = AttendanceRecord::where('employee_id', $employee->id)
            ->where('work_date', $workDate)
            ->first();

        $settings = LaborSetting::where('branch_id', $employee->branch_id)->first();
        if (!$settings) {
            $settings = LaborSetting::where('company_id', $employee->company_id)->whereNull('branch_id')->first();
        }

        return response()->json([
            'record' => $record,
            'settings' => $settings ? [
                'entry_time' => $settings->entry_time,
                'exit_time' => $settings->exit_time,
                'late_tolerance_minutes' => $settings->late_tolerance_minutes,
                'chair_law_enabled' => (bool) $settings->chair_law_enabled,
                'late_count_before_penalty' => $settings->late_count_before_penalty,
                'penalty_wage_days' => $settings->penalty_wage_days,
                'weekly_hours_by_year' => $settings->weekly_hours_by_year,
            ] : [
                'entry_time' => '08:30:00',
                'exit_time' => '17:00:00',
                'late_tolerance_minutes' => 10,
                'chair_law_enabled' => true,
                'late_count_before_penalty' => 3,
                'penalty_wage_days' => 1,
                'weekly_hours_by_year' => [
                    2026 => 48, 2027 => 46, 2028 => 44, 2029 => 42, 2030 => 40
                ],
            ]
        ]);
    }

    public function checkIn(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $workDate = now()->toDateString();
        $currentTime = now();

        $record = AttendanceRecord::where('employee_id', $employee->id)
            ->where('work_date', $workDate)
            ->first();

        if ($record && $record->check_in) {
            return response()->json(['message' => 'Ya has registrado tu entrada el día de hoy.'], 422);
        }

        // Get labor settings to evaluate lateness
        $settings = LaborSetting::where('branch_id', $employee->branch_id)->first();
        if (!$settings) {
            $settings = LaborSetting::where('company_id', $employee->company_id)->whereNull('branch_id')->first();
        }

        $status = 'present';
        if ($settings) {
            $entryLimit = Carbon::createFromTimeString($settings->entry_time)->addMinutes($settings->late_tolerance_minutes);
            if (Carbon::now()->toTimeString() > $entryLimit->toTimeString()) {
                $status = 'late';
            }
        }

        if (!$record) {
            $record = AttendanceRecord::create([
                'employee_id' => $employee->id,
                'work_date' => $workDate,
                'check_in' => $currentTime,
                'status' => $status,
            ]);
        } else {
            $record->update([
                'check_in' => $currentTime,
                'status' => $status,
            ]);
        }

        // Grant small XP for on-time check-in
        if ($status === 'present') {
            $employee->increment('xp', 10);
        }

        return response()->json([
            'message' => $status === 'present' ? 'Entrada registrada a tiempo. ¡Que tengas un excelente día!' : 'Entrada registrada con retraso.',
            'record' => $record,
            'xp_earned' => $status === 'present' ? 10 : 0
        ]);
    }

    public function checkOut(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $workDate = now()->toDateString();
        $record = AttendanceRecord::where('employee_id', $employee->id)
            ->where('work_date', $workDate)
            ->first();

        if (!$record || !$record->check_in) {
            return response()->json(['message' => 'Primero debes registrar tu entrada.'], 422);
        }

        if ($record->check_out) {
            return response()->json(['message' => 'Ya has registrado tu salida el día de hoy.'], 422);
        }

        $record->update([
            'check_out' => now(),
        ]);

        return response()->json([
            'message' => 'Salida registrada correctamente. ¡Buen descanso!',
            'record' => $record,
        ]);
    }

    public function history(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $records = AttendanceRecord::where('employee_id', $employee->id)
            ->orderBy('work_date', 'desc')
            ->take(30)
            ->get();

        return response()->json($records);
    }
}
