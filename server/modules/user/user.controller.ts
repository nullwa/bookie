import { Body, Controller, Post } from '@nestjs/common'

// #region imports
import { UserService } from '@/modules/user/user.service'
import { UserCreateDto } from '@/modules/user/dto/user.dto'
import { Public } from '@/core/decorators/public.decorator'
import { ApiTags } from '@nestjs/swagger'
// #endregion

@Public()
@Controller('user')
@ApiTags('users')
class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('create')
  create(@Body() userCreateDto: UserCreateDto) {
    return this._userService.create(userCreateDto)
  }
}
export { UserController }
