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

   public findAll = async (page=1, limit=10):  Promise<PaginatedUserResponseDto<User>> => {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 10 : limit;
    const [data, total] = await this._userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order:{createdAt: 'DESC'}
    });
    return new PaginatedUserResponseDto(data,total,page,limit);
  }

  public findOne = async (uid: number): Promise<User> => {
    const userData = await this._userRepository.findOne({where: {uid}});
    if(!userData){
      throw new NotFoundException(`User with id ${uid} not found`);
    }
    return userData
  }

  public update = async (uid: number, updateUserDto: UpdateUserDto): Promise<User> => {
    const user = await this._userRepository.preload({uid, ...updateUserDto})
    if(!user)
      throw new NotFoundException(`User with id ${uid} not found`)
    
    return this._userRepository.save(user);
  }

  public remove = async (uid: number): Promise<boolean> => {
    const result = await this._userRepository.softDelete({ uid });
    if (result.affected === 0){
      throw new NotFoundException(`This action removes a #${uid} user`);
    }
    return true;
  }

  public findByEmail = (email: string): Promise<User | null> => {
    return this._userRepository.findOne({ where: { email } })
  }
} 
