import { DocumentBuilder } from '@nestjs/swagger'

const openApiConfig = new DocumentBuilder()
  .setTitle(process.env.APP_NAME as string)
  .setDescription('An API representation of a classic Bookie—handling risk, taking action, and making sure the house always wins in the end.')
  .setVersion(process.env.APP_VERSION as string)
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
  .build()

export { openApiConfig }
