import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Business } from '@/business/entity/business.entity'
import { Address } from '@/business/entity/address.entity'
import { Contact } from '@/business/entity/contact.entity'
import { BusinessService } from '@/business/service/business.service'
import { BusinessController } from '@/business/controller/business.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Business, Address, Contact])],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
