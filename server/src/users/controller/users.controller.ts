import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { UsersService } from '@/users/service/users.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { Roles } from '@/_app/decorators/role.decorator'
import { Abilities } from '@/_app/decorators/abilities.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Roles('ADMIN')
  @Abilities('TENANT_MOD')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
