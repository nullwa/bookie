<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
  use AuthorizesRequests;

  public function index()
  {
    $this->authorize('viewAny', User::class);

    return UserResource::collection(User::all());
  }

  public function store(UserRequest $request)
  {
    $this->authorize('create', User::class);

    return new UserResource(User::create($request->validated()));
  }

  public function show(User $user)
  {
    $this->authorize('view', $user);

    return new UserResource($user);
  }

  public function update(UserRequest $request, User $user)
  {
    $this->authorize('update', $user);

    $user->update($request->validated());

    return new UserResource($user);
  }

  public function destroy(User $user)
  {
    $this->authorize('delete', $user);

    $user->delete();

    return response()->json();
  }
}
