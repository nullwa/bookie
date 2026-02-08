import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from '@/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.APP_PORT ?? 3000)
}

bootstrap()
  .then(() => {
    console.log('Application is running on port', process.env.APP_PORT ?? 3000)
  })
  .catch((err) => {
    console.error('Error starting the application:', err)
    process.exit(1)
  })
