import { IsString } from "class-validator"

// DTO for email sending
export class MailMutateDto {
  @IsString()
  user_name: string

  @IsString()
  user_email: string

  @IsString()
  subject: string

  @IsString()
  content: 'reset-password.template.hbs' | 'welcome.template.hbs'

  @IsString()
  token: string
}