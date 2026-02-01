<?php

namespace App\Http\Requests;

use App\Enums\AuthType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, ValidationRule|array<mixed>|string>
   */
  public function rules(): array // Changed from validate() to rules()
  {
    return match ($this->input('type')) {
      "BY_PHONE" => [
        'first_name' => ['required', 'string'],
        'last_name' => ['required', 'string'],
        'phone' => ['required', 'string', 'max:8', 'min:8', 'unique:users'],
        'password' => ['required', 'string', 'min:8'],
      ],
      "BY_MAIL" => [
        'first_name' => ['required', 'string'],
        'last_name' => ['required', 'string'],
        'email' => ['required', 'string', 'email', 'max:75', 'unique:users'],
        'password' => ['required', 'string', 'min:8'],
      ],
      default => []
    };
  }
}