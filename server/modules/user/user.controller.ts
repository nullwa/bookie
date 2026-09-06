import { Body, Controller, Post } from '@nestjs/common'

// #region imports
import { UserService } from '@/modules/user/user.service'
import { UserCreateDto } from '@/modules/user/dto/user-create.dto'
import { Public } from '@/common/decorators/public.decorator'
// #endregion

@Public()
@Controller('user')
class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('create')
  create(@Body() userCreateDto: UserCreateDto) {
    return this._userService.create(userCreateDto)
  }
}
export { UserController }
