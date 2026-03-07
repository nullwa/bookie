import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { FindManyOptions, Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@/users/entity/user.entity'

import { RequestUserQueryDto } from '@/users/dto/user-query-dto'
import { UserCreateDto, UserUpdateDto } from '@/users/dto/user-mutate.dto'
import { parseParamValue, parseOrderBy, mapSortDirection, parseKeyValue } from '@/_app/constants/helper'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private _userRepository: Repository<User>) {}

  /**
   * @description Create a new user
   * @param createUserDto
   * @returns User
   */
  public create = (userCreateDto: UserCreateDto): Promise<User | null> => {
    const user = this._userRepository.create(userCreateDto)
    return this._userRepository.save(user)
  }

  /**
   * @description Retrieves a paginated list of users based on the provided page and limit parameters. The method calculates the appropriate offset and limit for the database query, retrieves the users, and returns them along with pagination metadata.
   * @param userQueryDto
   * @returns
   */
  public findAll = async (userQueryDto: RequestUserQueryDto): Promise<{ data: User[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const { page = 1, limit = 25, sort, search, fields, include } = userQueryDto

    // metadata
    const entityMetadata = this._userRepository.metadata
    const validColumns = entityMetadata.columns.map((c) => c.propertyName)
    const validRelations = entityMetadata.relations.map((r) => r.propertyName)

    const errors: string[] = []

    // search
    const where: Record<string, any> = {}
    parseKeyValue<User>(search).forEach((s) => {
      if (!validColumns.includes(s.field as string)) errors.push(`Invalid search field: ${s.field}`)
      else where[s.field] = Like(`%${s.value}%`)
    })

    // select
    const select = parseParamValue<User>(fields)
    select.forEach((f) => {
      if (!validColumns.includes(f as string)) errors.push(`Invalid field requested: ${f}`)
    })

    // relations
    const relations = parseParamValue<User>(include)
    relations.forEach((r) => {
      if (!validRelations.includes(r as string)) errors.push(`Invalid relation requested: ${r}`)
    })

    // sort
    let order: FindManyOptions<User>['order'] = { createdAt: 'DESC' } // default
    if (sort) {
      const [field, direction] = Object.entries(parseOrderBy<User>(sort))[0]
      if (!validColumns.includes(field as string)) errors.push(`Invalid orderBy field: ${field}`)
      else order = { [field]: mapSortDirection(direction) as 'ASC' | 'DESC' }
    }

    // errors
    if (errors.length) throw new BadRequestException(errors)

    // data
    const options: FindManyOptions<User> = {
      where: Object.keys(where).length ? where : undefined,
      select: select.length ? (select as (keyof User)[]) : undefined,
      relations: relations.length ? relations : undefined,
      order: order,
      skip: (page - 1) * limit,
      take: limit,
    }
    const [data, total] = await this._userRepository.findAndCount(options)

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  /**
   * @description Retrieves a user by their unique identifier (uid). If the user is not found, a NotFoundException is thrown.
   * @param uid
   * @returns
   */
  public findOne = async (uid: number): Promise<User> => {
    const userData = await this._userRepository.findOne({ where: { uid } })
    if (!userData) throw new NotFoundException(`User with id ${uid} not found`)

    return userData
  }

  /**
   * @description Updates a user's information based on their unique identifier (uid) and the provided update data. The method first attempts to preload the user entity with the new data, and if the user is not found, it throws a NotFoundException. If the user is found, it saves the updated user entity to the database and returns it.
   * @param uid
   * @param updateUserDto
   * @returns
   */
  public update = async (uid: number, userUpdateDto: UserUpdateDto): Promise<User> => {
    const user = await this._userRepository.preload({ uid, ...userUpdateDto })
    if (!user) throw new NotFoundException(`User with id ${uid} not found`)

    return this._userRepository.save(user)
  }

  /**
   * @description Soft deletes a user by their unique identifier (uid). The method attempts to soft delete the user, and if no records are affected (i.e., the user is not found), it throws a NotFoundException. If the deletion is successful, it returns true.
   * @param uid
   * @returns
   */
  public remove = async (uid: number): Promise<boolean> => {
    const result = await this._userRepository.softDelete({ uid })
    if (result.affected === 0) throw new NotFoundException(`This action removes a #${uid} user`)

    return true
  }

  /**
   * @description Finds a user by their email address.
   * @param email
   * @returns User
   * @throws NotFoundException if the user with the specified email is not found.
   */
  public findByEmail = async (email: string): Promise<User> => {
    const user = await this._userRepository.findOne({ where: { email } })
    if (!user) throw new NotFoundException(`User with email ${email} not found`)

    return user
  }
}
