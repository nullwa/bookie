import { createParamDecorator, ExecutionContext } from '@nestjs/common'

const Profile = createParamDecorator((_: unknown, ctx: ExecutionContext): Typed.Auth.Profile => {
  const request = ctx.switchToHttp().getRequest<Typed.Auth.AuthenticationRequest>()
  return request.user
})
export { Profile }
