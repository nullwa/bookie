<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{

  public function register(AuthRequest $request)
  {

    $request->validated();

    return response()->json([
      'message' => 'Registered successfully',
      'user' => $request->validated(), // send validated data
      'test' => $request->input("type")
    ], 201);
  }


  /**
   * @description Authenticate
   * @return void
   */
  public function login()
  {
  }
}
