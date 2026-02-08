import { TypeOrmModuleOptions } from '@nestjs/typeorm'

const typeormConfig: TypeOrmModuleOptions = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: true
}

export { typeormConfig }