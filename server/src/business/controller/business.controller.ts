import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'

import { BusinessService } from '@/business/service/business.service'
import { RequestBusinessQueryDto } from '@/business/dto/business-query.dto'
import { BusinessCreateDto, BusinessUpdateDto } from '@/business/dto/business-mutate.dto'

import { Roles } from '@/_app/decorators/role.decorator'
import { Abilities } from '@/_app/decorators/abilities.decorator'

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * @description This method is responsible for creating a new business.
   * @param businessCreateDto
   * @returns The created business object or null if the creation fails.
   */
  @Post()
  @Roles('ADMIN', 'BUSINESS_OWNER')
  @Abilities('BUSINESS_MOD')
  create(@Body() businessCreateDto: BusinessCreateDto) {
    return this.businessService.create(businessCreateDto)
  }

  /**
   * @description This method retrieves a paginated list of businesses based on the provided query parameters.
   * @param businessQueryDto
   * @returns An object containing the list of businesses and pagination metadata.
   */
  @Get()
  @Abilities('BUSINESS_VIEW')
  findAll(@Query() businessQueryDto: RequestBusinessQueryDto) {
    return this.businessService.findAll(businessQueryDto)
  }

  /**
   * @description This method retrieves a single business by its unique identifier (id).
   * @param id
   * @returns The business object corresponding to the provided id, or null if no business is found.
   */
  @Get(':id')
  @Abilities('BUSINESS_VIEW')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(+id)
  }

  /**
   * @description This method updates an existing business's information based on its unique identifier (id) and the provided update data.
   * @param id
   * @param businessUpdateDto
   * @returns The updated business object after the update operation is performed, or null if the update fails or the business is not found.
   */
  @Patch(':id')
  @Roles('ADMIN', 'BUSINESS_OWNER')
  @Abilities('BUSINESS_MOD')
  update(@Param('id') id: string, @Body() businessUpdateDto: BusinessUpdateDto) {
    return this.businessService.update(+id, businessUpdateDto)
  }

  /**
   * @description This method deletes a business based on its unique identifier (id).
   * @param id
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  @Roles('ADMIN', 'BUSINESS_OWNER')
  @Abilities('BUSINESS_MOD')
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id)
  }
}
