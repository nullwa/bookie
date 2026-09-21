import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { openApiConfig } from '@/core/config/openapi.config'

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

  /**
   * Expose the OpenAPI JSON document at `/openapi-json` without enabling the
   * Swagger UI.
   */
  const documentFactory = () => SwaggerModule.createDocument(app, openApiConfig)
  SwaggerModule.setup('openapi', app, documentFactory, {
    ui: false,
    raw: ['json'],
    jsonDocumentUrl: 'openapi.json',
  })
  app.use(
    '/api-documentation',
    apiReference({
      content: documentFactory,
      theme: 'alternate',
      darkMode: true,
      persistAuth: true,
      authentication: { preferredSecurityScheme: 'access-token' },
      agent: { disabled: true },
    })
  )

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
