import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Business } from '@/business/entity/business.entity'
import { Contact } from '@/business/entity/contact.entity'
import { Address } from '@/business/entity/address.entity'

import { UpdateBusinessDto } from '@/business/dto/update-business.dto'
import { CreateBusinessDto } from '@/business/dto/create-business.dto'

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business) private readonly _businessRepository: Repository<Business>,
    @InjectRepository(Address) private readonly _addressRepository: Repository<Address>,
    @InjectRepository(Contact) private readonly _contactRepository: Repository<Contact>,
  ) {}

  create(createBusinessDto: CreateBusinessDto) {
    return 'This action adds a new business'
  }

  findAll() {
    return `This action returns all business`
  }

  findOne(id: number) {
    return `This action returns a #${id} business`
  }

  update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`
  }

  remove(id: number) {
    return `This action removes a #${id} business`
  }
}
