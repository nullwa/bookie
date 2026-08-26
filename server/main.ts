import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from '@/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  /**
   * Strip unknown properties and reject requests undeclared fields.
   * this prevents mass-assignment attackes where a caller sends extra fields.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in the DTO
      forbidNonWhitelisted: true, // thrown 400 if unknown props are sent
      transform: true, // aut-transform primitives
    })
  )

  /**
   * Restricts CORS to your frontend origin in production.
   * the env var APP_CORS_ORIGIN should be set per environment.
   */
  app.enableCors({
    origin: process.env.APP_CORS ?? 'http://localhost:3000',
    credentials: true,
  })

  await app.listen(process.env.APP_PORT ?? 3000)
}

bootstrap()
  .then(() => {
    console.log('Application is running on port', process.env.APP_PORT ?? 3000)
    console.log('CORS origin is', process.env.APP_CORS ?? 'http://localhost:3000')
  })
  .catch((err) => {
    console.error('Error starting the application:', err)
    process.exit(1)
  })
