import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

// #region #imports
import { AuthService } from '@/core/auth/auth.service'

import { Public } from '@/core/decorators/public.decorator'
import { Profile } from '@/core/decorators/profile.decorator'

import { AuthRegisterDto, AuthLoginDto, AuthRefreshTokenDto } from '@/core/auth/dto/auth.dto'
// #endregion

@ApiTags('Authentication')
@Controller('auth')
class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiOperation({ summary: 'Get current user', description: 'Returns the profile of the currently authenticated user.' })
  @Get('profile')
  profile(@Profile() profile: Typed.Auth.Profile) {
    return profile
  }

  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account using the provided registration information.' })
  @Public()
  @Post('register')
  register(@Body() authRegisterDTO: AuthRegisterDto) {
    return this._authService.register(authRegisterDTO)
  }

  @ApiOperation({ summary: 'Authenticate a user', description: 'Authenticates a user using their credentials and returns authentication tokens.' })
  @Public()
  @Post('login')
  login(@Body() authLoginDTO: AuthLoginDto) {
    return this._authService.login(authLoginDTO)
  }

  @ApiOperation({ summary: 'Refresh auth tokens', description: 'Generates a new authentication token using a valid refresh token.' })
  @Post('refresh')
  public refresh(@Body() authRefreshTokenDto: AuthRefreshTokenDto): Promise<Typed.Auth.Token> {
    return this._authService.refresh(authRefreshTokenDto.refreshToken)
  }

  @ApiOperation({ summary: 'Log out a user', description: 'Invalidates the provided refresh token.' })
  @Post('logout')
  public logout(@Body() authRefreshTokenDto: AuthRefreshTokenDto): Promise<void> {
    return this._authService.logout(authRefreshTokenDto.refreshToken)
  }
}

export { AuthController }
