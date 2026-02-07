import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeormConfig } from '@/database/typeorm.config'

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
