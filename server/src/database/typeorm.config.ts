import { TypeOrmModuleOptions } from '@nestjs/typeorm'

const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3000,
  username: 'root',
  password: 'root',
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: true,
}

export { typeormConfig }
