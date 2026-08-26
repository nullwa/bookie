import { Request } from 'express'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'

import { AuthService } from '@/modules/auth/services/auth.service'

// There's no standard passport strategy for "phone + OTP", so this uses
// passport-custom to keep the same guard/strategy pattern as the other
// login methods: the request has already been validated (OTP checked)
// by the time it reaches the controller.
@Injectable()
export class AuthOtpStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate(req: Request) {
    const { phone, otp } = req.body
    const isValid = this.authService.verifyPhoneOtp(phone, otp)
    if (!isValid) throw new UnauthorizedException('Invalid or expired code')
    return { phone }
  }
}
