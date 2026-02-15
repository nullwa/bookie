import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'

import { User } from '@/users/entity/user.entity'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'


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

   public findAll = async (): Promise<User[]> => {
    return await this._userRepository.find();
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
