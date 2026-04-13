import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { FindManyOptions, Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'

import { User } from '@/user/entity/user.entity'
import { Employee } from '@/user/entity/employee.entity'
import { Customer } from '@/user/entity/customer.entity'

import { eUserRole } from '@/_app/constants/enum'
import { RequestUserQueryDto } from '@/user/dto/user-query-dto'
import { UserCreateDto, UserUpdateDto } from '@/user/dto/user-mutate.dto'
import { parseParamValue, parseOrderBy, mapSortDirection, parseKeyValue } from '@/_app/constants/helper'
import { compare } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Employee) private readonly _employeeRepository: Repository<Employee>,
    @InjectRepository(Customer) private readonly _customerRepository: Repository<Customer>,
  ) {}

  /**
   * @description Create a new user
   *
   * @param createUserDto
   * @returns User
   */
  public create = (userCreateDto: UserCreateDto): Promise<User> => {
    const user = this._userRepository.create(userCreateDto)
    return this._userRepository.save(user)
  }

  /**
   * @description Retrieves a paginated list of users based on the provided page and limit parameters. The method calculates the appropriate offset and limit for the database query, retrieves the users, and returns them along with pagination metadata.
   *
   * @param userQueryDto
   * @returns metadata and data
   */
  public findAll = async (userQueryDto: RequestUserQueryDto): Promise<{ data: User[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const { page = 1, limit = 25, sort, search, include } = userQueryDto

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
      relations: relations.length ? relations : undefined,
      order: order,
      skip: (page - 1) * limit,
      take: limit,
    }
    const [data, total] = await this._userRepository.findAndCount(options)

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  /**
   * @description Finds a user by their unique identifier (uid) and role type. The method retrieves the user along with their associated employee or customer information based on the specified role type. If the user is not found, a NotFoundException is thrown.
   *
   * @param uid
   * @param type
   * @returns
   */
  public findOne = async (uid: number, type?: eUserRole): Promise<User> => {
    const roleRelationMap: Partial<Record<eUserRole, keyof Pick<User, 'employee' | 'customer'>>> = {
      [eUserRole.CLIENT]: 'customer',
      [eUserRole.BUSINESS_OWNER]: 'employee',
      [eUserRole.BUSINESS_STUFF]: 'employee',
    }

    const relation = type !== undefined ? roleRelationMap[type] : undefined

    const userData = await this._userRepository.findOne({
      where: { uid },
      ...(relation && { relations: [relation] }),
    })

    if (!userData) throw new NotFoundException(`User with uid ${uid} not found`)
    return userData
  }

  /**
   * @description Finds a user by their email address.
   *
   * @param email
   * @returns User
   * @throws NotFoundException if the user with the specified email is not found.
   */
  public findByEmail = async (email: string): Promise<User | null> => {
    return await this._userRepository.findOne({
      where: { email },
      // Explicitly select password since the column has select: false
      select: ['uid', 'firstName', 'lastName', 'email', 'password', 'role', 'abilities', 'verfiedAt', 'passwordChangedAt'],
    })
  }

  /**
   * @description Finds a user by their associated employee code. The method first attempts to find an employee with the provided code, and if found, it returns the associated user. If no employee is found with the specified code, a NotFoundException is thrown.
   *
   * @param code
   * @returns User | null
   * @throws NotFoundException if the user with the specified employee code is not found.
   */
  public findByEmployeeCode = async (code: string): Promise<Employee | null> => {
    const employee = await this._employeeRepository.findOne({
      where: { code },
      relations: ['user'],
    })
    if (!employee) throw new NotFoundException(`User with employee code ${code} not found`)

    return employee
  }

  /**
   * @description Finds VIP customers based on their VIP status. The method retrieves customers with the specified VIP status and their associated user information. If no customers are found with the specified VIP status, a NotFoundException is thrown.
   *
   * @param isVip
   * @returns Customer[]
   * @throws NotFoundException if no VIP customers are found.
   */
  public findIsVipCustomer = async (isVip: boolean): Promise<Customer[]> => {
    const customers = await this._customerRepository.find({
      where: { isVip },
      relations: ['user'],
    })
    if (!customers.length) throw new NotFoundException(`No VIP customers found`)

    return customers
  }
  /**
   * @description Finds a user by their associated Google ID.
   *
   * @param googleId
   * @returns User
   * @throws NotFoundException if the user with the specified Google ID is not found.
   * @remarks This method is used in the Google OAuth strategy to find or create a user based on their Google profile information.
   */
  public findByGoogleId = async (googleId: string): Promise<User | null> => {
    return await this._userRepository.findOne({ where: { googleId } })
  }

  /**
   * @description Updates a user's information based on their unique identifier (uid) and the provided update data. The method first attempts to preload the user entity with the new data, and if the user is not found, it throws a NotFoundException. If the user is found, it saves the updated user entity to the database and returns it.
   *
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
   * @description Validate if a user existe while authenticating with google
   *
   * @param profile
   * @returns user
   */
  public validateGoogleUser = async (profile: { googleId: string; email: string; name: string; avatar: string | null }): Promise<User> => {
    const userByGoogleId = await this._userRepository.findOne({ where: { googleId: profile.googleId } })
    if (userByGoogleId) return userByGoogleId

    // Link existing account with Google
    const userByEmail = await this._userRepository.findOne({ where: { email: profile.email } })
    if (userByEmail) {
      // Links a google account to an existing user by updating the user's record.
      await this._userRepository.update({ uid: userByEmail.uid }, { googleId: profile.googleId, ...(profile.avatar ? { avatar: profile.avatar } : {}) })
      return this._userRepository.findOneOrFail({ where: { uid: userByEmail.uid } })
    }

    const [firstName, ...rest] = profile.name.split(' ')

    const user = this._userRepository.create({
      firstName: firstName,
      lastName: rest.join(' ') || '-',
      googleId: profile.googleId,
      email: profile.email,
      password: randomBytes(32).toString('hex'),
      avatar: profile.avatar ?? '',
      role: eUserRole.GUEST,
    })

    return this._userRepository.save(user)
  }

  /**
   * @description Save the refresh token so we double check the validity of the token
   *
   * @param uid
   * @param token
   */
  public setRefreshToken = async (uid: number, token: string | null): Promise<void> => {
    await this._userRepository.update({ uid }, { refreshToken: token })
  }

  /**
   * @description Validate the refresh token of the user when loging in
   *
   * @param uid
   * @param refreshToken
   * @returns
   */
  public validateRefreshToken = async (uid: number, refreshToken: string): Promise<User | null> => {
    const user = await this._userRepository.findOne({
      where: { uid },
      select: ['uid', 'email', 'role', 'abilities', 'refreshToken'],
    })
    if (!user || !user.refreshToken) return null
    const isValid = await compare(refreshToken, user.refreshToken)
    return isValid ? user : null
  }
}
