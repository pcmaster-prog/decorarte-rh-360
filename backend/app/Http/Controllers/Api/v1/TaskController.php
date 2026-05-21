<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\TaskAssignment;
use App\Models\TaskComment;
use App\Models\TaskEvidence;
use App\Models\TaskTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $tasks = TaskAssignment::with(['template', 'evidences'])
            ->where('employee_id', $employee->id)
            ->where('assigned_date', now()->toDateString())
            ->get();

        return response()->json($tasks);
    }

    public function start(Request $request, $id)
    {
        $employee = $request->user()->employee;
        $task = TaskAssignment::where('employee_id', $employee->id)->findOrFail($id);

        if ($task->status !== 'pending') {
            return response()->json(['message' => 'Esta tarea ya ha sido iniciada o completada.'], 422);
        }

        $task->update(['status' => 'in_progress']);

        return response()->json([
            'message' => 'Tarea iniciada',
            'task' => $task
        ]);
    }

    public function complete(Request $request, $id)
    {
        $employee = $request->user()->employee;
        $task = TaskAssignment::with('template')->where('employee_id', $employee->id)->findOrFail($id);

        if ($task->status === 'completed') {
            return response()->json(['message' => 'Esta tarea ya ha sido completada.'], 422);
        }

        $request->validate([
            'value' => 'nullable|string',
            'photo' => 'nullable|string', // Base64 string
        ]);

        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Save evidence if provided
        if ($request->filled('value') || $request->filled('photo')) {
            $filePath = null;
            if ($request->filled('photo')) {
                // Decode base64 image
                $image = $request->input('photo'); // format: data:image/png;base64,iVBORw0KGgoAAAANS...
                if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
                    $image = substr($image, strpos($image, ',') + 1);
                    $type = strtolower($type[1]); // png, jpg, jpeg

                    if (in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                        $image = str_replace(' ', '+', $image);
                        $imageName = 'evidence_' . $task->id . '_' . Str::random(10) . '.' . $type;
                        $filePath = 'evidences/' . $imageName;
                        Storage::disk('public')->put($filePath, base64_decode($image));
                    }
                }
            }

            TaskEvidence::create([
                'task_assignment_id' => $task->id,
                'value' => $request->input('value'),
                'file_path' => $filePath,
            ]);
        }

        // Grant XP rewards
        $xpEarned = $task->template ? $task->template->xp_reward : 15;
        $employee->increment('xp', $xpEarned);

        return response()->json([
            'message' => '¡Tarea completada con éxito!',
            'task' => $task,
            'xp_earned' => $xpEarned,
            'xp_total' => $employee->xp
        ]);
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $employee = $request->user()->employee;
        $task = TaskAssignment::findOrFail($id);

        // Verify if user is employee assigned or has manager permissions
        if ($task->employee_id !== $employee->id && !$request->user()->hasRole('admin') && !$request->user()->hasRole('supervisor')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment = TaskComment::create([
            'task_assignment_id' => $task->id,
            'employee_id' => $employee->id,
            'comment' => $request->input('comment'),
        ]);

        return response()->json([
            'message' => 'Comentario agregado',
            'comment' => $comment
        ]);
    }

    public function store(Request $request)
    {
        // Supervisor task assignment
        if (!$request->user()->hasRole('admin') && !$request->user()->hasRole('supervisor')) {
            return response()->json(['message' => 'No autorizado para asignar tareas.'], 403);
        }

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'estimated_minutes' => 'nullable|integer',
            'xp_reward' => 'nullable|integer',
            'due_time' => 'nullable',
        ]);

        // Create task template dynamically if it doesn't exist, or just use custom template
        $template = TaskTemplate::create([
            'company_id' => $request->user()->employee->company_id,
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'estimated_minutes' => $request->input('estimated_minutes', 15),
            'xp_reward' => $request->input('xp_reward', 15),
        ]);

        $task = TaskAssignment::create([
            'employee_id' => $request->input('employee_id'),
            'task_template_id' => $template->id,
            'status' => 'pending',
            'assigned_date' => now()->toDateString(),
            'due_time' => $request->input('due_time'),
        ]);

        return response()->json([
            'message' => 'Tarea asignada correctamente.',
            'task' => TaskAssignment::with('template')->find($task->id)
        ]);
    }
}
