import { TypeOrmModuleOptions } from '@nestjs/typeorm'

const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: '',
  autoLoadEntities: true,
  synchronize: true
}

export { typeormConfig }