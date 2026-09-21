import { DocumentBuilder } from '@nestjs/swagger'

const openApiConfig = new DocumentBuilder()
  .setTitle(process.env.APP_NAME as string)
  .setDescription('An API representation of a classic Bookie—handling risk, taking action, and making sure the house always wins in the end.')
  .setVersion(process.env.APP_VERSION as string)
  // 1. JWT Bearer Auth scheme
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT bearer token',
      in: 'header',
    },
    'JWT-auth' // Internal security name referenced in @ApiBearerAuth('JWT-auth')
  )
  // 2. Google OAuth2 Authorization Code flow scheme
  .addOAuth2(
    {
      type: 'oauth2',
      description: 'Google OAuth2 Authentication',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          scopes: {
            openid: 'OpenID Connect access',
            email: 'Access user email address',
            profile: 'Access basic profile information',
          },
        },
      },
    },
    'Google-OAuth2' // Internal security name referenced in @ApiOAuth2(['email', 'profile'], 'Google-OAuth2')
  )
  .build()

export { openApiConfig }
