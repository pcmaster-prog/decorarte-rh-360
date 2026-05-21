<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\LaborSetting;
use Illuminate\Http\Request;

class LaborSettingController extends Controller
{
    public function show(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $settings = LaborSetting::where('branch_id', $employee->branch_id)->first();
        if (!$settings) {
            $settings = LaborSetting::where('company_id', $employee->company_id)->whereNull('branch_id')->first();
        }

        if (!$settings) {
            // Generar valores por defecto si no existen
            $settings = LaborSetting::create([
                'company_id' => $employee->company_id,
                'branch_id' => $employee->branch_id,
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
        }

        return response()->json([
            'toleranciaMinutos' => (int) $settings->late_tolerance_minutes,
            'horaEntrada' => substr($settings->entry_time, 0, 5), // HH:MM
            'horaSalida' => substr($settings->exit_time, 0, 5),   // HH:MM
            'retardosParaSancion' => (int) $settings->late_count_before_penalty,
            'descuentoDiasPorSancion' => (int) $settings->penalty_wage_days,
            'leySillaActiva' => (bool) $settings->chair_law_enabled,
            'reduccionJornada' => $settings->weekly_hours_by_year ?: [
                2026 => 48,
                2027 => 46,
                2028 => 44,
                2029 => 42,
                2030 => 40
            ]
        ]);
    }

    public function update(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $settings = LaborSetting::where('branch_id', $employee->branch_id)->first();
        if (!$settings) {
            $settings = LaborSetting::where('company_id', $employee->company_id)->whereNull('branch_id')->first();
        }

        if (!$settings) {
            $settings = new LaborSetting();
            $settings->company_id = $employee->company_id;
            $settings->branch_id = $employee->branch_id;
        }

        $validated = $request->validate([
            'toleranciaMinutos' => 'integer|min:0',
            'horaEntrada' => 'string|regex:/^\d{2}:\d{2}$/',
            'horaSalida' => 'string|regex:/^\d{2}:\d{2}$/',
            'retardosParaSancion' => 'integer|min:1',
            'descuentoDiasPorSancion' => 'integer|min:0',
            'leySillaActiva' => 'boolean',
            'reduccionJornada' => 'array',
        ]);

        if (isset($validated['toleranciaMinutos'])) {
            $settings->late_tolerance_minutes = $validated['toleranciaMinutos'];
        }
        if (isset($validated['horaEntrada'])) {
            $settings->entry_time = $validated['horaEntrada'] . ':00';
        }
        if (isset($validated['horaSalida'])) {
            $settings->exit_time = $validated['horaSalida'] . ':00';
        }
        if (isset($validated['retardosParaSancion'])) {
            $settings->late_count_before_penalty = $validated['retardosParaSancion'];
        }
        if (isset($validated['descuentoDiasPorSancion'])) {
            $settings->penalty_wage_days = $validated['descuentoDiasPorSancion'];
        }
        if (isset($validated['leySillaActiva'])) {
            $settings->chair_law_enabled = $validated['leySillaActiva'];
        }
        if (isset($validated['reduccionJornada'])) {
            $settings->weekly_hours_by_year = $validated['reduccionJornada'];
        }

        $settings->save();

        return response()->json([
            'toleranciaMinutos' => (int) $settings->late_tolerance_minutes,
            'horaEntrada' => substr($settings->entry_time, 0, 5),
            'horaSalida' => substr($settings->exit_time, 0, 5),
            'retardosParaSancion' => (int) $settings->late_count_before_penalty,
            'descuentoDiasPorSancion' => (int) $settings->penalty_wage_days,
            'leySillaActiva' => (bool) $settings->chair_law_enabled,
            'reduccionJornada' => $settings->weekly_hours_by_year
        ]);
    }
}
