import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig = (_configService: ConfigService): TypeOrmModuleOptions => ({
  type: _configService.getOrThrow<'mysql' | 'postgres'>('DATABASE_TYPE', 'mysql'),
  host: _configService.getOrThrow<string>('DATABASE_HOST'),
  port: _configService.getOrThrow<number>('DATABASE_PORT'),
  username: _configService.getOrThrow<string>('DATABASE_USER'),
  password: _configService.getOrThrow<string>('DATABASE_PASSWORD'),
  database: _configService.getOrThrow<string>('DATABASE_NAME'),
  autoLoadEntities: true,
  synchronize: _configService.getOrThrow<boolean>('DATABASE_SYNC', false),
})
