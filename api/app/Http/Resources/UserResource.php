<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'name' => $this->first_name . ' ' . $this->last_name,
      'email' => $this->email,
      'deleted_at' => $this->deleted_at,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
