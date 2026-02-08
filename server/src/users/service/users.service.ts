import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

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

  findAll() {
    return this._userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }

  public findByEmail = (email: string): Promise<User | null> => {
    return this._userRepository.findOne({ where: { email } })
  }
} 
