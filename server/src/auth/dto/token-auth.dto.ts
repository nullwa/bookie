import { IsString } from "class-validator";

export class TokenAuthDto {
  /**
   * @description DTO: The JWT token returned after successful authentication.
   */
  @IsString()
  token: string
}