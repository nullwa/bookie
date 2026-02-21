import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@/users/entity/user.entity'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { PaginatedUserResponseDto } from '../dto/paginated-user-response.dto'


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private _userRepository: Repository<User>) { }

  /**
   * @description Create a new user
   * @param createUserDto
   * @returns User
   */
  public create = (createUserDto: CreateUserDto): Promise<User | null> => {
    const user = this._userRepository.create(createUserDto)
    return this._userRepository.save(user)
  }

  /**
   * @description Retrieves a paginated list of users based on the provided page and limit parameters. The method calculates the appropriate offset and limit for the database query, retrieves the users, and returns them along with pagination metadata.
   * @param page 
   * @param limit 
   * @returns 
   */
  public findAll = async (page = 1, limit = 10): Promise<PaginatedUserResponseDto<User>> => {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;
    const [data, total] = await this._userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });
    return new PaginatedUserResponseDto(data, total, page, limit);
  }

  /**
   * @description Retrieves a user by their unique identifier (uid). If the user is not found, a NotFoundException is thrown.
   * @param uid
   * @returns 
   */
  public findOne = async (uid: number): Promise<User> => {
    const userData = await this._userRepository.findOne({ where: { uid } });
    if (!userData) {
      throw new NotFoundException(`User with id ${uid} not found`);
    }
    return userData
  }

  /**
   * @description Updates a user's information based on their unique identifier (uid) and the provided update data. The method first attempts to preload the user entity with the new data, and if the user is not found, it throws a NotFoundException. If the user is found, it saves the updated user entity to the database and returns it.
   * @param uid 
   * @param updateUserDto 
   * @returns 
   */
  public update = async (uid: number, updateUserDto: UpdateUserDto): Promise<User> => {
    const user = await this._userRepository.preload({ uid, ...updateUserDto })
    if (!user)
      throw new NotFoundException(`User with id ${uid} not found`)

    return this._userRepository.save(user);
  }

  /**
   * @description Soft deletes a user by their unique identifier (uid). The method attempts to soft delete the user, and if no records are affected (i.e., the user is not found), it throws a NotFoundException. If the deletion is successful, it returns true.
   * @param uid 
   * @returns 
   */
  public remove = async (uid: number): Promise<boolean> => {
    const result = await this._userRepository.softDelete({ uid });
    if (result.affected === 0) {
      throw new NotFoundException(`This action removes a #${uid} user`);
    }
    return true;
  }

  /**
   * @description Finds a user by their email address.
   * @param email 
   * @returns User
   * @throws NotFoundException if the user with the specified email is not found. 
   */
  public findByEmail = async (email: string): Promise<User> => {
    const user = await this._userRepository.findOne({ where: { email } })

    if (!user)
      throw new NotFoundException(`User with email ${email} not found`)

    return user
  }
} 
