<?php

use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\DashboardController;
use App\Http\Controllers\Api\v1\AttendanceController;
use App\Http\Controllers\Api\v1\TaskController;
use App\Http\Controllers\Api\v1\LMSController;
use App\Http\Controllers\Api\v1\EmployeeController;
use App\Http\Controllers\Api\v1\LaborSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - DecorArte RH 360
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::prefix('v1')->group(function () {
    
    // Public routes (Auth & ATS candidate access)
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/google', [AuthController::class, 'googleLogin']);
    Route::get('vacancies', [EmployeeController::class, 'getVacancies']);
    Route::post('apply', [EmployeeController::class, 'apply']);

    // Protected routes (Sanctum auth required)
    Route::middleware('auth:sanctum')->group(function () {
        
        // Auth management
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // Dashboard widgets
        Route::get('dashboard', [DashboardController::class, 'index']);

        // Attendance tracking
        Route::get('attendance/status', [AttendanceController::class, 'status']);
        Route::post('attendance/check-in', [AttendanceController::class, 'checkIn']);
        Route::post('attendance/check-out', [AttendanceController::class, 'checkOut']);
        Route::get('attendance/history', [AttendanceController::class, 'history']);

        // Labor Settings management
        Route::get('labor-settings', [LaborSettingController::class, 'show']);
        Route::put('labor-settings', [LaborSettingController::class, 'update']);

        // Checklists & Tasks
        Route::get('tasks', [TaskController::class, 'index']);
        Route::post('tasks', [TaskController::class, 'store']);
        Route::post('tasks/{id}/start', [TaskController::class, 'start']);
        Route::post('tasks/{id}/complete', [TaskController::class, 'complete']);
        Route::post('tasks/{id}/comment', [TaskController::class, 'addComment']);

        // LMS Training Academy
        Route::get('lms/courses', [LMSController::class, 'courses']);
        Route::post('lms/courses/{id}/enroll', [LMSController::class, 'enroll']);
        Route::get('lms/courses/{id}', [LMSController::class, 'getCourseDetails']);
        Route::post('lms/courses/{courseId}/lessons/{lessonId}/complete', [LMSController::class, 'completeLesson']);
        Route::post('lms/courses/{id}/quiz', [LMSController::class, 'submitQuiz']);

        // Collaborators & ATS admin views
        Route::get('employees', [EmployeeController::class, 'index']);
        Route::get('employees/{id}', [EmployeeController::class, 'show']);
        Route::put('employees/{id}', [EmployeeController::class, 'update']);
        Route::post('employees/{id}/files', [EmployeeController::class, 'uploadFile']);
        Route::get('applicants', [EmployeeController::class, 'getApplicants']);
    });
});
