import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const typeOrmConfig = (_configService: ConfigService): TypeOrmModuleOptions => ({
  type: _configService.get<'mysql' | 'postgres'>('DATABASE_TYPE', 'mysql'),
  host: _configService.get<string>('DATABASE_HOST'),
  port: _configService.get<number>('DATABASE_PORT'),
  username: _configService.get<string>('DATABASE_USER'),
  password: _configService.get<string>('DATABASE_PASSWORD'),
  database: _configService.get<string>('DATABASE_NAME'),
  autoLoadEntities: true,
  synchronize: _configService.get<boolean>('DATABASE_SYNC', false),
})
