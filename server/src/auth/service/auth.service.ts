import { Injectable } from '@nestjs/common'
import { CreateAuthDto } from '@/auth/dto/login-auth.dto'

@Injectable()
export class AuthService {
  login(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth'
  }
}
