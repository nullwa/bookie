<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Routing\Controller;

class UserController extends Controller
{
  /**
   * @description Display a listing of the users.
   * @return ResourceCollection
   */
  public function index(): ResourceCollection
  {
    return UserResource::collection(User::all());
  }

  /**
   * @description Store a newly created user.
   * @param UserRequest $request
   * @return UserResource
   */
  public function store(UserRequest $request): UserResource
  {
    return new UserResource(User::create($request->validated()));
  }

  /**
   * @description Display a user
   * @param User $user
   * @return UserResource
   */
  public function show(User $user): UserResource
  {
    return new UserResource($user);
  }

  /**
   * @description  Update the specified user
   * @param UserRequest $request
   * @param User $user
   * @return UserResource
   */
  public function update(UserRequest $request, User $user): UserResource
  {
    $user->update($request->validated());
    return new UserResource($user);
  }

  /**
   * @description Remove the specified user
   * @param User $user
   * @return bool
   */
  public function destroy(User $user): bool
  {
    return $user->delete();
  }
}
