<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return response()->json([
    'status' => 'bookie',
    'message' => 'Application is up',
  ], 201);
});
