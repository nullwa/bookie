import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from '@/database/typeorm.config'

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  exports: [TypeOrmModule]
})

export class DatabaseModule {
  constructor(private dataSource: DataSource) {
    this.dataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!')
      })
      .catch((err) => {
        console.error('Error during Data Source initialization:', err)
      })
  }
}
