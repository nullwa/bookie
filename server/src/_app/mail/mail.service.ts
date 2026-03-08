import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

import { MailMutateDto } from '@/_app/mail/dto/mail-mutate.dto'

export enum MailTemplate {
  RESET_PASSWORD = 'reset-password.template.hbs',
  VERIFY_EMAIL = 'verify-email.template.hbs',
  WELCOME = 'welcome.template.hbs',
}

@Injectable()
export class MailService {
  private readonly _frontendUrl: string
  private readonly _logger: Logger = new Logger(MailService.name)

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {
    const frontendUrl = this._configService.get<string>('MAIL_FRONTEND_URL')

    if (!frontendUrl) throw new Error('MAIL_FRONTEND_URL is not defined in environment variables')

    this._frontendUrl = frontendUrl
  }

  /**
   * Sends a templated email using the configured mail provider.
   */
  public async sendMail(mailMutateDto: MailMutateDto): Promise<void> {
    try {
      const context = this.buildContext(mailMutateDto)

      await this._mailerService.sendMail({
        to: mailMutateDto.user_email,
        subject: mailMutateDto.subject,
        template: mailMutateDto.content,
        context,
      })
    } catch (error) {
      this._logger.error(`Failed to send email to ${mailMutateDto.user_email}`, error?.stack)
      throw new InternalServerErrorException('Failed to send email')
    }
  }

  /**
   * @description Builds the context object for the email template based on the provided MailMutateDto.
   * @param mailMutateDto
   * @returns An object containing the context variables for the email template.
   */
  private buildContext(mailMutateDto: MailMutateDto) {
    const baseContext = {
      appName: this._configService.get<string>('APP_NAME'),
      name: mailMutateDto.user_name,
      tokenExpires: mailMutateDto.tokenExpires,
      year: new Date().getFullYear(),
    }

    switch (mailMutateDto.content) {
      case MailTemplate.RESET_PASSWORD:
        return {
          ...baseContext,
          resetLink: this.buildLink('reset-password', mailMutateDto.token),
          supportEmail: this._configService.get<string>('MAIL_SUPPORT_EMAIL'),
        }

      case MailTemplate.VERIFY_EMAIL:
        return {
          ...baseContext,
          verifyLink: this.buildLink('verify-email', mailMutateDto.token),
        }

      case MailTemplate.WELCOME:
      default:
        return baseContext
    }
  }

  /**
   * @description Builds a URL link for the email template based on the provided path and token.
   * @param path
   * @param token
   * @returns A string containing the full URL link for the email template, or undefined if the token is not provided.
   */
  private buildLink(path: string, token?: string): string | undefined {
    if (!token) return undefined
    return `${this._frontendUrl}/${path}?token=${token}`
  }
}
