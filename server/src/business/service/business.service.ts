import { BadRequestException, Injectable } from '@nestjs/common'
import { FindManyOptions, Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Business } from '@/business/entity/business.entity'
import { Contact } from '@/business/entity/contact.entity'
import { Address } from '@/business/entity/address.entity'
import { Employee } from '@/user/entity/employee.entity'

import { BusinessCreateDto, BusinessUpdateDto } from '@/business/dto/business-mutate.dto'
import { RequestBusinessQueryDto } from '@/business/dto/business-query.dto'
import { mapSortDirection, parseKeyValue, parseOrderBy } from '@/_app/constants/helper'

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business) private readonly _businessRepository: Repository<Business>,
    @InjectRepository(Address) private readonly _addressRepository: Repository<Address>,
    @InjectRepository(Contact) private readonly _contactRepository: Repository<Contact>,
    @InjectRepository(Employee) private readonly _employeeRepository: Repository<Employee>,
  ) {}

  /**
   * @description Create a new business with its contact and address
   *
   * @param businessCreateDto
   * @returns Business
   */
  public create = (businessCreateDto: BusinessCreateDto): Promise<Business> => {
    const business = this._businessRepository.create(businessCreateDto)
    return this._businessRepository.save(business)
  }

  /**
   * @description Get all businesses with pagination, sorting, and searching
   *
   * @param businessQueryDto
   * @returns metadata and data
   */
  public findAll = async (businessQueryDto: RequestBusinessQueryDto): Promise<{ data: Business[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const { page = 1, limit = 25, sort, search } = businessQueryDto

    // metadata
    const entityMetadata = this._businessRepository.metadata
    const validColumns = entityMetadata.columns.map((c) => c.propertyName)

    const errors: string[] = []

    // search
    const where: Record<string, any> = {}
    parseKeyValue<Business>(search).forEach((s) => {
      if (!validColumns.includes(s.field as string)) errors.push(`Invalid search field: ${s.field}`)
      else where[s.field] = Like(`%${s.value}%`)
    })

    // sort
    let order: FindManyOptions<Business>['order'] = { createdAt: 'DESC' } // default
    if (sort) {
      const [field, direction] = Object.entries(parseOrderBy<Business>(sort))[0]
      if (!validColumns.includes(field as string)) errors.push(`Invalid orderBy field: ${field}`)
      else order = { [field]: mapSortDirection(direction) as 'ASC' | 'DESC' }
    }

    // errors
    if (errors.length) throw new BadRequestException(errors)

    // data
    const options: FindManyOptions<Business> = {
      where: Object.keys(where).length ? where : undefined,
      relations: ['contact', 'address'],
      order: order,
      skip: (page - 1) * limit,
      take: limit,
    }
    const [data, total] = await this._businessRepository.findAndCount(options)

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  /**
   * @description Get a business by id
   *
   * @param id
   * @returns business
   */
  public findOne = async (uid: number): Promise<Business> => {
    const business = await this._businessRepository.findOne({ where: { uid: uid }, relations: ['contact', 'address'] })
    if (!business) throw new BadRequestException(`Business with id ${uid} not found`)
    return business
  }

  /**
   * @description Update a business by id
   *
   * @param uid
   * @param businessUpdateDto
   * @returns
   */
  public update = async (uid: number, businessUpdateDto: BusinessUpdateDto): Promise<Business> => {
    const user = await this._businessRepository.preload({ uid, ...businessUpdateDto })
    if (!user) throw new BadRequestException(`Business with id ${uid} not found`)
    return this._businessRepository.save(user)
  }

  /**
   * @description Soft delete a business by id
   *
   * @param uid
   * @returns
   */
  public remove = async (uid: number): Promise<boolean> => {
    const result = await this._businessRepository.softDelete({ uid })
    if (result.affected === 0) throw new BadRequestException(`Business with id ${uid} not found`)
    return true
  }
}
