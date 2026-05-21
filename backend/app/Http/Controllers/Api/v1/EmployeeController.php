<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\ApplicantDocument;
use App\Models\Employee;
use App\Models\EmployeeFile;
use App\Models\JobApplication;
use App\Models\JobVacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            return response()->json(['message' => 'Colaborador no encontrado'], 404);
        }

        $employees = Employee::with(['position', 'department'])
            ->where('company_id', $employee->company_id)
            ->where('branch_id', $employee->branch_id)
            ->get();

        return response()->json($employees);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $employee = $user->employee;

        $target = Employee::with(['position', 'department', 'user.role', 'attendanceRecords' => function ($q) {
            $q->orderBy('work_date', 'desc')->take(10);
        }])->findOrFail($id);

        // Security check: must belong to the same company
        if ($target->company_id !== $employee->company_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $files = EmployeeFile::where('employee_id', $target->id)->get();

        return response()->json([
            'employee' => $target,
            'files' => $files
        ]);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        // Security checks: only admin or self-update for contact info
        if ($request->user()->employee->id !== $employee->id && !$request->user()->hasRole('admin') && !$request->user()->hasRole('supervisor')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $rules = [
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
        ];

        // Supervisor/Admin can edit more fields
        if ($request->user()->hasRole('admin') || $request->user()->hasRole('supervisor')) {
            $rules = array_merge($rules, [
                'department_id' => 'exists:departments,id',
                'position_id' => 'exists:positions,id',
                'status' => 'string|in:active,inactive,suspended',
                'salary_base' => 'numeric',
            ]);
        }

        $request->validate($rules);
        $employee->update($request->only(array_keys($rules)));

        return response()->json([
            'message' => 'Colaborador actualizado con éxito.',
            'employee' => $employee
        ]);
    }

    public function uploadFile(Request $request, $id)
    {
        $request->validate([
            'document_type' => 'required|string',
            'file' => 'required|string', // Base64 representation
        ]);

        $employee = Employee::findOrFail($id);

        if ($request->user()->employee->id !== $employee->id && !$request->user()->hasRole('admin') && !$request->user()->hasRole('supervisor')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $base64File = $request->input('file');
        $filePath = null;

        if (preg_match('/^data:application\/pdf;base64,/', $base64File)) {
            $data = substr($base64File, strpos($base64File, ',') + 1);
            $fileName = 'expediente_' . $employee->id . '_' . $request->document_type . '_' . Str::random(8) . '.pdf';
            $filePath = 'expedientes/' . $fileName;
            Storage::disk('public')->put($filePath, base64_decode($data));
        }

        if (!$filePath) {
            return response()->json(['message' => 'Formato de archivo inválido. Solo se permiten PDFs.'], 422);
        }

        $fileRecord = EmployeeFile::create([
            'employee_id' => $employee->id,
            'document_type' => $request->document_type,
            'file_path' => $filePath,
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Documento cargado correctamente en el expediente digital.',
            'file' => $fileRecord
        ]);
    }

    // --- Recrutiment ATS endpoints ---

    public function getVacancies(Request $request)
    {
        // Public endpoint to show open job opportunities
        $vacancies = JobVacancy::with('position')->where('status', 'open')->get();
        return response()->json($vacancies);
    }

    public function apply(Request $request)
    {
        // Public candidate application flow (No token required)
        $request->validate([
            'job_vacancy_id' => 'required|exists:job_vacancies,id',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'curp' => 'nullable|string',
            'rfc' => 'nullable|string',
            'nss' => 'nullable|string',
            'score' => 'nullable|integer',
            'answers' => 'nullable|array',
            'documents' => 'nullable|array', // key-value files CURP, RFC, NSS, CV in base64
        ]);

        $applicant = Applicant::create($request->only([
            'first_name', 'last_name', 'email', 'phone', 'curp', 'rfc', 'nss'
        ]));

        $application = JobApplication::create([
            'job_vacancy_id' => $request->job_vacancy_id,
            'applicant_id' => $applicant->id,
            'status' => 'applied',
            'score' => $request->input('score', 0),
            'answers' => $request->input('answers'),
        ]);

        // Upload documents if any
        if ($request->has('documents') && is_array($request->documents)) {
            foreach ($request->documents as $docType => $base64Data) {
                if (preg_match('/^data:application\/pdf;base64,/', $base64Data)) {
                    $data = substr($base64Data, strpos($base64Data, ',') + 1);
                    $fileName = 'applicant_' . $applicant->id . '_' . $docType . '_' . Str::random(8) . '.pdf';
                    $filePath = 'applicants/' . $fileName;
                    Storage::disk('public')->put($filePath, base64_decode($data));

                    ApplicantDocument::create([
                        'applicant_id' => $applicant->id,
                        'document_type' => $docType,
                        'file_path' => $filePath,
                        'status' => 'pending',
                    ]);
                }
            }
        }

        return response()->json([
            'message' => '¡Postulación enviada correctamente!',
            'application' => $application
        ]);
    }

    public function getApplicants(Request $request)
    {
        // ATS View for Supervisor/Admin
        if (!$request->user()->hasRole('admin') && !$request->user()->hasRole('supervisor')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $applications = JobApplication::with(['applicant.documents', 'vacancy.position'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }
}
