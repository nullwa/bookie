import { TokenAuthDto } from "./token-auth.dto";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordAuthDto {
  /**
   * @description DTO: The JWT token used to verify the user's identity and authorization to reset the password. This token is typically generated during the password reset request process and sent to the user's email. It should be included in the request body when submitting the new password.
   */
  token: TokenAuthDto

  /**
   * @description DTO: The new password must be at least 8 characters long.
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
}