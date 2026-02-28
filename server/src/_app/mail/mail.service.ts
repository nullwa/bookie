import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

import { MailMutateDto } from '@/_app/mail/dto/mail-mutate.dto'

@Injectable()
export class MailService {
  private readonly _frontendUrl: string | undefined

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService
  ) {
    this._frontendUrl = this._configService.get<string>('MAIL_FRONTEND_URL')
  }

  /**
   * @description   * Sends a templated email using the configured mail provider.
   * @param mailMutateDto - Object containing email metadata and template info.
   * @throws InternalServerErrorException if sending fails.
   */
  public sendMail = async (mailMutateDto: MailMutateDto): Promise<void> => {
    const resetLink = `${this._frontendUrl}/reset-password?token=${mailMutateDto.token}`

    try {
      await this._mailerService.sendMail({
        to: mailMutateDto.user_email,
        subject: mailMutateDto.subject,
        template: mailMutateDto.content,
        context: {
          appName: this._configService.get<string>('APP_NAME'),
          name: mailMutateDto.user_name,
          tokenExpires: mailMutateDto.tokenExpires,
          resetLink,
          supportEmail: this._configService.get<string>('MAIL_SUPPORT_EMAIL'),
          year: new Date().getFullYear(),
        }
      })
    } catch { throw new InternalServerErrorException('Failed to send email') }
  }
}