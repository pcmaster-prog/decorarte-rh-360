<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'DecorArte RH 360 API',
        'status' => 'online',
        'version' => '1.0.0'
    ]);
});
