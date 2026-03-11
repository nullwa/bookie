import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

import { UsersService } from '@/users/service/users.service'
import { RequestUserQueryDto } from '@/users/dto/user-query-dto'
import { UserCreateDto, UserUpdateDto } from '@/users/dto/user-mutate.dto'

import { Public } from '@/_app/decorators/public.decorator'
import { Roles } from '@/_app/decorators/role.decorator'
import { Abilities } from '@/_app/decorators/abilities.decorator'

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * @description This method is responsible for creating a new user.
   * @param userCreateDto
   * @returns The created user object or null if the creation fails.
   */
  @Post()
  @Roles('ADMIN')
  @Abilities('TENANT_MOD')
  create(@Body() userCreateDto: UserCreateDto) {
    return this.usersService.create(userCreateDto)}

  /**
   * @description This method retrieves a paginated list of users based on the provided query parameters.
   * @param userQueryDto 
   * @returns An object containing the list of users and pagination metadata.
   */
  @Get()
  findAll(@Query() userQueryDto: RequestUserQueryDto) {
    return this.usersService.findAll(userQueryDto)}

    /**
   * @description This method retrieves a single user by their employee code.
   * @param code
    * @returns The user object corresponding to the provided employee code, or null if no user is found.
    */
  @Get('employee/:code')
  findByEmployeeCode(@Param('code') code: string) {
    return this.usersService.findByEmployeeCode(code)}
  
  /**
   * @description This method retrieves a single user by their unique identifier (id).
   * @param id
   * @returns The user object corresponding to the provided id, or null if no user is found.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)}

  /**
   * @description This method updates an existing user's information based on their unique identifier (id) and the provided update data.
   * @param id
   * @param userUpdateDto 
   * @returns The updated user object after the update operation is performed, or null if the update fails or the user is not found.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() userUpdateDto: UserUpdateDto) {
    return this.usersService.update(+id, userUpdateDto)}

  /**
   * @description This method deletes a user based on their unique identifier (id)
   * @param id
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)}
}
